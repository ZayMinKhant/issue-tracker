import { StyleSheet, Text, View } from 'react-native';
import { Lucide } from '@react-native-vector-icons/lucide';
import SelectDropdown from 'react-native-select-dropdown';
import { colors } from '../../theme/colors';

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface SelectFieldProps<T extends string> {
  disabled?: boolean;
  onChange: (value: T) => void;
  options: ReadonlyArray<SelectOption<T>>;
  placeholder?: string;
  selectedValue?: T;
  title: string;
}

export function SelectField<T extends string>({
  disabled = false,
  onChange,
  options,
  placeholder = 'Select an option',
  selectedValue,
  title,
}: SelectFieldProps<T>) {
  const selectedOption = options.find((option) => option.value === selectedValue);

  return (
    <View>
      <SelectDropdown
        data={[...options]}
        defaultValue={selectedOption}
        disabled={disabled}
        dropdownOverlayColor="rgba(15, 23, 42, 0.12)"
        dropdownStyle={styles.dropdown}
        onSelect={(option) => {
          onChange(option.value);
        }}
        renderButton={(option, isOpened) => (
          <View
            accessibilityLabel={title}
            accessibilityState={{ disabled, expanded: isOpened }}
            style={[
              styles.trigger,
              disabled ? styles.triggerDisabled : null,
              isOpened ? styles.triggerOpen : null,
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.triggerLabel,
                !option ? styles.placeholderLabel : null,
              ]}
            >
              {option?.label ?? placeholder}
            </Text>
            <Lucide
              color={isOpened ? colors.accent : colors.muted}
              name={isOpened ? 'chevron-up' : 'chevron-down'}
              size={18}
              style={styles.triggerIcon}
            />
          </View>
        )}
        renderItem={(option, _index, isSelected) => (
          <View
            style={[
              styles.option,
              isSelected ? styles.optionSelected : null,
            ]}
          >
            <Text
              style={[
                styles.optionLabel,
                isSelected ? styles.optionLabelSelected : null,
              ]}
            >
              {option.label}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        statusBarTranslucent
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: -4,
  },
  option: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionLabel: {
    color: colors.text,
    fontSize: 14,
  },
  optionLabelSelected: {
    color: colors.accent,
    fontWeight: '700',
  },
  optionSelected: {
    backgroundColor: colors.accentMuted,
  },
  placeholderLabel: {
    color: colors.muted,
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.line,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  triggerDisabled: {
    opacity: 0.65,
  },
  triggerIcon: {
    marginLeft: 12,
  },
  triggerLabel: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
  },
  triggerOpen: {
    borderColor: colors.accent,
  },
});
