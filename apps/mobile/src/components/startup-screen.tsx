import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const brandIcon = require('../assets/branding/viatick-icon.png');

export function StartupScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.glowLarge} />
      <View style={styles.glowSmall} />
      <View style={styles.content}>
        <View style={styles.iconCard}>
          <Image resizeMode="contain" source={brandIcon} style={styles.icon} />
        </View>
        <Text style={styles.title}>ViatickIssueTracker</Text>
        <Text style={styles.subtitle}>Loading issues and live updates...</Text>
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.accent} size="small" />
          <Text style={styles.loadingLabel}>Loading...</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F9FBFE',
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  glowLarge: {
    backgroundColor: 'rgba(196, 228, 255, 0.28)',
    borderRadius: 240,
    height: 320,
    position: 'absolute',
    right: -88,
    top: 120,
    width: 320,
  },
  glowSmall: {
    backgroundColor: 'rgba(255, 226, 104, 0.22)',
    borderRadius: 140,
    height: 180,
    left: -42,
    top: 168,
    width: 180,
  },
  icon: {
    height: 196,
    width: 196,
  },
  iconCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderColor: 'rgba(28, 41, 80, 0.06)',
    borderRadius: 40,
    borderWidth: 1,
    elevation: 4,
    justifyContent: 'center',
    padding: 16,
    shadowColor: '#1C2950',
    shadowOffset: {
      height: 18,
      width: 0,
    },
    shadowOpacity: 0.08,
    shadowRadius: 32,
  },
  loadingLabel: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  loadingRow: {
    alignItems: 'center',
    columnGap: 10,
    flexDirection: 'row',
    marginTop: 24,
  },
  subtitle: {
    color: '#5B85B1',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  title: {
    color: '#1C2950',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 28,
    textAlign: 'center',
  },
});
