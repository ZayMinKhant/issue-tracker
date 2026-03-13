import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';

interface ChoiceChipProps {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  selected: boolean;
}

export function ChoiceChip({
  disabled = false,
  label,
  onPress,
  selected,
}: ChoiceChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : styles.chipIdle,
        pressed && !disabled ? styles.chipPressed : null,
        disabled ? styles.chipDisabled : null,
      ]}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipDisabled: {
    opacity: 0.45,
  },
  chipIdle: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
  },
  chipPressed: {
    transform: [{ scale: 0.98 }],
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  labelSelected: {
    color: colors.surface,
  },
});
