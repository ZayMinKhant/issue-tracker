import { render, screen, waitFor } from '@testing-library/react-native';
import App from '../App';
import { getIssues } from '../src/features/issues/api/api';

jest.mock('react-native-select-dropdown', () => {
  const React = require('react');

  return ({ defaultValue, renderButton }: any) => renderButton(defaultValue, false);
});

jest.mock('react-native-date-picker', () => () => null);

jest.mock('@react-native-vector-icons/lucide', () => ({
  Lucide: () => null,
}));

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');

  return ({ children }: { children?: React.ReactNode }) => <View>{children}</View>;
});

jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');

  class TestQueryClient extends actual.QueryClient {
    constructor(config: any = {}) {
      super({
        ...config,
        defaultOptions: {
          ...config.defaultOptions,
          queries: {
            gcTime: 0,
            retry: false,
            ...config.defaultOptions?.queries,
          },
        },
      });
    }
  }

  return {
    ...actual,
    QueryClient: TestQueryClient,
  };
});

jest.mock('@react-navigation/native', () => ({
  DefaultTheme: {
    colors: {
      background: '#fff',
      border: '#ddd',
      card: '#fff',
      notification: '#000',
      primary: '#000',
      text: '#000',
    },
  },
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => {
    const React = require('react');

    return {
      Navigator: ({ children }: { children: unknown }) => {
        const firstChild = React.Children.toArray(children)[0] as {
          props: {
            component: any;
            name: string;
          };
        };
        const Component = firstChild.props.component;

        return (
          <Component
            navigation={{
              goBack: jest.fn(),
              navigate: jest.fn(),
            }}
            route={{
              key: firstChild.props.name,
              name: firstChild.props.name,
              params: undefined,
            }}
          />
        );
      },
      Screen: () => null,
    };
  },
}));

jest.mock('@react-native-documents/picker', () => ({
  errorCodes: {
    OPERATION_CANCELED: 'OPERATION_CANCELED',
  },
  isErrorWithCode: jest.fn(() => false),
  pick: jest.fn(),
  types: {
    allFiles: '*/*',
  },
}));

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    disconnect: jest.fn(),
    on: jest.fn(),
  })),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../src/features/issues/api/api', () => ({
  createIssue: jest.fn(),
  deleteIssue: jest.fn(),
  getIssue: jest.fn(),
  getIssues: jest.fn(),
  updateIssue: jest.fn(),
}));

const mockedGetIssues = jest.mocked(getIssues);
const originalConsoleError = console.error;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((message, ...args) => {
    const normalizedMessage =
      typeof message === 'string' ? message : String(message);

    if (
      normalizedMessage.includes('VirtualizedList inside a test') &&
      normalizedMessage.includes('wrapped in act')
    ) {
      return;
    }

    originalConsoleError(message, ...args);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('App', () => {
  it('renders the issue desk shell', async () => {
    mockedGetIssues.mockResolvedValue({
      items: [],
      meta: {
        limit: 5,
        page: 1,
        total: 0,
        totalPages: 1,
      },
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No issues match these filters')).toBeTruthy();
    });

    expect(screen.getByText('Search and filters')).toBeTruthy();
    expect(screen.getByPlaceholderText('Search by issue title')).toBeTruthy();
  });
});
