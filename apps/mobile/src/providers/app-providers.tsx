import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from '../navigation/app-navigator';
import { colors } from '../theme/colors';
import { IssuesRealtimeBridge } from '../features/issues/realtime';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    border: colors.line,
    card: colors.surface,
    primary: colors.accent,
    text: colors.text,
  },
};

export function AppProviders() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 15_000,
          },
        },
      }),
  );

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={navigationTheme}>
          <IssuesRealtimeBridge />
          <AppNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
