import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  createIssueSchema,
  getErrorMessage,
  normalizeOptionalTextInput,
  type CreateIssueFormValues,
} from '@issue-tracker/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { createIssue } from '../../features/issues/api';
import { getPickedAttachmentName } from '../../features/issues/attachments';
import { IssueFormFields } from '../../features/issues/issue-form-fields';
import { issueKeys } from '../../features/issues/query-keys';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateIssue'>;

export function CreateIssueScreen({ navigation }: Props) {
  const queryClient = useQueryClient();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<CreateIssueFormValues>({
    defaultValues: {
      attachmentName: '',
      category: 'GENERAL',
      description: '',
      submitterName: '',
      title: '',
    },
    resolver: zodResolver(createIssueSchema),
  });

  const attachmentName = useWatch({
    control,
    name: 'attachmentName',
  });

  const createMutation = useMutation({
    mutationFn: createIssue,
    onError: (error) => {
      Alert.alert('Could not create issue', getErrorMessage(error));
    },
    onSuccess: (issue) => {
      queryClient.setQueryData(issueKeys.detail(issue.id), issue);
      void queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      Alert.alert('Issue created', `Saved "${issue.title}".`);
      navigation.goBack();
    },
  });

  async function handlePickAttachment() {
    try {
      const files = await pick({
        allowMultiSelection: false,
        mode: 'import',
        type: [types.allFiles],
      });

      setValue('attachmentName', getPickedAttachmentName(files), {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (error) {
      if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
        return;
      }

      Alert.alert('Could not select file', getErrorMessage(error));
    }
  }

  const onSubmit = handleSubmit((values) => {
    createMutation.mutate({
      attachmentName: values.attachmentName || undefined,
      category: values.category,
      description: values.description,
      submitterName: normalizeOptionalTextInput(values.submitterName),
      title: values.title,
    });
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <IssueFormFields
          attachmentName={attachmentName}
          control={control}
          errors={errors}
          onPickAttachment={handlePickAttachment}
        />

        <Pressable
          disabled={createMutation.isPending}
          onPress={onSubmit}
          style={({ pressed }) => [
            styles.submitButton,
            createMutation.isPending ? styles.submitDisabled : null,
            pressed && !createMutation.isPending ? styles.submitPressed : null,
          ]}
        >
          <Text style={styles.submitLabel}>
            {createMutation.isPending ? 'Saving...' : 'Create Issue'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 999,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitLabel: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  submitPressed: {
    transform: [{ scale: 0.98 }],
  },
});
