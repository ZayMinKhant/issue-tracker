import type { Issue } from '@issue-tracker/types';
import { formatEnumLabel, statusLabels } from '@issue-tracker/utils';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, statusColors } from '../../theme/colors';

interface IssueListItemProps {
  issue: Issue;
  onPress: (issue: Issue) => void;
}

export function IssueListItem({ issue, onPress }: IssueListItemProps) {
  const badgeColors = statusColors[issue.status];

  return (
    <Pressable
      onPress={() => onPress(issue)}
      style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleBlock}>
          <Text numberOfLines={1} style={styles.title}>
            {issue.title}
          </Text>
          <Text numberOfLines={2} style={styles.description}>
            {issue.description}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: badgeColors.backgroundColor,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeLabel,
              {
                color: badgeColors.textColor,
              },
            ]}
          >
            {statusLabels[issue.status]}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Category</Text>
        <Text style={styles.metaValue}>{formatEnumLabel(issue.category)}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Reported by</Text>
        <Text style={styles.metaValue}>{issue.submitterName || 'Anonymous'}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Created</Text>
        <Text style={styles.metaValue}>
          {new Date(issue.createdAt).toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 24,
    borderWidth: 1,
    elevation: 2,
    marginBottom: 14,
    padding: 18,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 1,
    shadowRadius: 18,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  metaLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaValue: {
    color: colors.text,
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 16,
    textAlign: 'right',
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  titleBlock: {
    flex: 1,
    marginRight: 12,
  },
});
