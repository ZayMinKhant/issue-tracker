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
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SelectField } from '../../components/ui/select-field';
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
          <SelectField
            disabled={disabled}
            onChange={onChange}
            options={ISSUE_CATEGORIES.map((category) => ({
              label: formatEnumLabel(category),
              value: category,
            }))}
            selectedValue={value}
            title="Issue Category"
          />
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
              <SelectField
                disabled={disabled}
                onChange={onChange}
                options={ISSUE_STATUSES.map((status) => ({
                  label: statusLabels[status],
                  value: status,
                }))}
                selectedValue={value}
                title="Issue Status"
              />
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
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  attachmentButtonLabel: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
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
  fieldError: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 18,
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
    borderRadius: 10,
    borderWidth: 1,
    color: colors.text,
    fontSize: 14,
    marginTop: 8,
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputDisabled: {
    opacity: 0.65,
  },
  textArea: {
    minHeight: 120,
  },
});
