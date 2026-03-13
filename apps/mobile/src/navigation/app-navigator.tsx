import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateIssueScreen } from '../screens/issues/create-issue-screen';
import { IssueDetailScreen } from '../screens/issues/issue-detail-screen';
import { IssuesListScreen } from '../screens/issues/issues-list-screen';
import { colors } from '../theme/colors';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="IssuesList"
      screenOptions={{
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen
        component={IssuesListScreen}
        name="IssuesList"
        options={{ title: 'Issue Desk' }}
      />
      <Stack.Screen
        component={CreateIssueScreen}
        name="CreateIssue"
        options={{
          presentation: 'modal',
          title: 'Create Issue',
        }}
      />
      <Stack.Screen
        component={IssueDetailScreen}
        name="IssueDetail"
        options={{ title: 'Issue Detail' }}
      />
    </Stack.Navigator>
  );
}
