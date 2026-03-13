import {
  ISSUE_CATEGORIES,
  ISSUE_STATUSES,
  type IssueCategory,
  type IssueStatus,
} from '@issue-tracker/types';
import { formatEnumLabel, statusLabels } from '@issue-tracker/utils';
import type { Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ChoiceChip } from '../../components/ui/choice-chip';
import { colors } from '../../theme/colors';

type IssueFormShape = {
  title: string;
  description: string;
  submitterName: string;
  category: IssueCategory;
  attachmentName?: string;
  status?: IssueStatus;
} & FieldValues;

interface IssueFormFieldsProps<T extends IssueFormShape> {
  attachmentName?: string;
  control: Control<T>;
  disabled?: boolean;
  errors: FieldErrors<T>;
  onPickAttachment: () => void;
  showStatus?: boolean;
}

function getFieldMessage<T extends IssueFormShape>(
  errors: FieldErrors<T>,
  key: keyof IssueFormShape,
) {
  const fieldError = errors[key as keyof T] as { message?: string } | undefined;
  return fieldError?.message;
}

function FieldLabel({ label }: { label: string }) {
  return <Text style={styles.fieldLabel}>{label}</Text>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <Text style={styles.fieldError}>{message}</Text>;
}

export function IssueFormFields<T extends IssueFormShape>({
  attachmentName,
  control,
  disabled = false,
  errors,
  onPickAttachment,
  showStatus = false,
}: IssueFormFieldsProps<T>) {
  return (
    <View style={styles.formCard}>
      <FieldLabel label="Issue Title" />
      <Controller
        control={control}
        name={'title' as Path<T>}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            editable={!disabled}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Describe the problem"
            placeholderTextColor={colors.muted}
            style={[styles.input, disabled ? styles.inputDisabled : null]}
            value={value}
          />
        )}
      />
      <FieldError message={getFieldMessage(errors, 'title')} />

      <FieldLabel label="Description" />
      <Controller
        control={control}
        name={'description' as Path<T>}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            editable={!disabled}
            multiline
            numberOfLines={5}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Add enough detail to route the issue"
            placeholderTextColor={colors.muted}
            style={[styles.input, styles.textArea, disabled ? styles.inputDisabled : null]}
            textAlignVertical="top"
            value={value}
          />
        )}
      />
      <FieldError message={getFieldMessage(errors, 'description')} />

      <FieldLabel label="Submitted By" />
      <Controller
        control={control}
        name={'submitterName' as Path<T>}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            editable={!disabled}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Optional name"
            placeholderTextColor={colors.muted}
            style={[styles.input, disabled ? styles.inputDisabled : null]}
            value={value}
          />
        )}
      />

      <FieldLabel label="Issue Category" />
      <Controller
        control={control}
        name={'category' as Path<T>}
        render={({ field: { onChange, value } }) => (
          <ScrollView
            horizontal
            contentContainerStyle={styles.chipRow}
            showsHorizontalScrollIndicator={false}
          >
            {ISSUE_CATEGORIES.map((category) => (
              <ChoiceChip
                disabled={disabled}
                key={category}
                label={formatEnumLabel(category)}
                onPress={() => onChange(category)}
                selected={value === category}
              />
            ))}
          </ScrollView>
        )}
      />
      <FieldError message={getFieldMessage(errors, 'category')} />

      {showStatus ? (
        <>
          <FieldLabel label="Issue Status" />
          <Controller
            control={control}
            name={'status' as Path<T>}
            render={({ field: { onChange, value } }) => (
              <ScrollView
                horizontal
                contentContainerStyle={styles.chipRow}
                showsHorizontalScrollIndicator={false}
              >
                {ISSUE_STATUSES.map((status) => (
                  <ChoiceChip
                    disabled={disabled}
                    key={status}
                    label={statusLabels[status]}
                    onPress={() => onChange(status)}
                    selected={value === status}
                  />
                ))}
              </ScrollView>
            )}
          />
          <FieldError message={getFieldMessage(errors, 'status')} />
        </>
      ) : null}

      <FieldLabel label="Attachment" />
      <Pressable
        disabled={disabled}
        onPress={onPickAttachment}
        style={({ pressed }) => [
          styles.attachmentButton,
          disabled ? styles.inputDisabled : null,
          pressed && !disabled ? styles.attachmentPressed : null,
        ]}
      >
        <Text style={styles.attachmentButtonLabel}>
          {attachmentName || 'Choose a file'}
        </Text>
        <Text style={styles.attachmentHint}>Filename only</Text>
      </Pressable>
      <FieldError message={getFieldMessage(errors, 'attachmentName')} />
    </View>
  );
}

const styles = StyleSheet.create({
  attachmentButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.line,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  attachmentButtonLabel: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
  },
  attachmentHint: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  attachmentPressed: {
    transform: [{ scale: 0.99 }],
  },
  chipRow: {
    paddingTop: 8,
  },
  fieldError: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 18,
    textTransform: 'uppercase',
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 28,
    borderWidth: 1,
    padding: 20,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.line,
    borderRadius: 20,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputDisabled: {
    opacity: 0.65,
  },
  textArea: {
    minHeight: 120,
  },
});
