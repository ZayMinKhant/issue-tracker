import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { CreateIssueScreen } from '../screens/issues/create-issue-screen';
import { IssueDetailScreen } from '../screens/issues/issue-detail-screen';
import { IssuesListScreen } from '../screens/issues/issues-list-screen';
import { colors } from '../theme/colors';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function HeaderGradient() {
  return (
    <LinearGradient
      colors={['#F8FBFF', '#EAF3FE', '#DDEEFF']}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={StyleSheet.absoluteFill}
    >
      <View style={styles.headerGlowTop} />
      <View style={styles.headerGlowRight} />
    </LinearGradient>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="IssuesList"
      screenOptions={{
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerBackground: () => <HeaderGradient />,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: 'transparent',
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
        options={({ navigation }) => ({
          title: 'Issue Desk',
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('CreateIssue')}
              style={({ pressed }) => [
                styles.headerButton,
                pressed ? styles.headerButtonPressed : null,
              ]}
            >
              <Text style={styles.headerButtonLabel}>Create Issue</Text>
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        component={CreateIssueScreen}
        name="CreateIssue"
        options={{
          headerRight: () => <View style={styles.headerTitleBalance} />,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <View style={styles.headerTitleBlock}>
              <Text style={styles.headerTitlePrimary}>Create Issue</Text>
              <Text style={styles.headerTitleSecondary}>
                Submit a field report
              </Text>
            </View>
          ),
          presentation: 'modal',
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

const styles = StyleSheet.create({
  headerButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 999,
    borderColor: colors.surface,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerButtonLabel: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  headerButtonPressed: {
    opacity: 0.85,
  },
  headerGlowRight: {
    backgroundColor: 'rgba(91, 155, 213, 0.16)',
    borderRadius: 120,
    height: 180,
    position: 'absolute',
    right: -32,
    top: -54,
    width: 180,
  },
  headerGlowTop: {
    backgroundColor: 'rgba(255, 255, 255, 0.58)',
    borderRadius: 120,
    height: 150,
    left: -22,
    position: 'absolute',
    top: -68,
    width: 150,
  },
  headerTitleBlock: {
    alignItems: 'center',
  },
  headerTitleBalance: {
    width: 40,
  },
  headerTitlePrimary: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  headerTitleSecondary: {
    color: colors.text,
    fontSize: 11,
    opacity: 0.72,
    marginTop: 1,
  },
});
