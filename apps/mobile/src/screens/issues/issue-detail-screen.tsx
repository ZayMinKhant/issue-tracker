import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Issue } from '@issue-tracker/types';
import {
  getErrorMessage,
  normalizeOptionalTextInput,
  statusLabels,
  toUpdateIssueFormValues,
  updateIssueSchema,
  type UpdateIssueFormValues,
} from '@issue-tracker/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { deleteIssue, getIssue, updateIssue } from '../../features/issues/api';
import { getPickedAttachmentName } from '../../features/issues/attachments';
import { IssueFormFields } from '../../features/issues/issue-form-fields';
import { issueKeys } from '../../features/issues/query-keys';
import type { RootStackParamList } from '../../navigation/types';
import { colors, statusColors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'IssueDetail'>;

export function IssueDetailScreen({ navigation, route }: Props) {
  const issueId = route.params.issueId;
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
    setValue,
  } = useForm<UpdateIssueFormValues>({
    defaultValues: {
      attachmentName: '',
      category: 'GENERAL',
      description: '',
      status: 'REPORTED',
      submitterName: '',
      title: '',
    },
    resolver: zodResolver(updateIssueSchema),
  });

  const issueQuery = useQuery<Issue | null>({
    enabled: Boolean(issueId),
    queryFn: () => getIssue(issueId),
    queryKey: issueKeys.detail(issueId),
  });

  const attachmentName = useWatch({
    control,
    name: 'attachmentName',
  });

  useEffect(() => {
    if (issueQuery.data && !isEditing) {
      reset(toUpdateIssueFormValues(issueQuery.data));
    }
  }, [isEditing, issueQuery.data, reset]);

  const updateMutation = useMutation({
    mutationFn: (values: UpdateIssueFormValues) =>
      updateIssue(issueId, {
        attachmentName: values.attachmentName || undefined,
        category: values.category,
        description: values.description,
        status: values.status,
        submitterName: normalizeOptionalTextInput(values.submitterName) ?? null,
        title: values.title,
      }),
    onError: (error) => {
      Alert.alert('Could not update issue', getErrorMessage(error));
    },
    onSuccess: (issue) => {
      queryClient.setQueryData(issueKeys.detail(issueId), issue);
      void queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      setIsEditing(false);
      Alert.alert('Issue updated', `Saved "${issue.title}".`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteIssue(issueId),
    onError: (error) => {
      Alert.alert('Could not delete issue', getErrorMessage(error));
    },
    onSuccess: () => {
      queryClient.setQueryData(issueKeys.detail(issueId), null);
      void queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
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
    updateMutation.mutate(values);
  });

  function confirmDelete() {
    Alert.alert('Delete issue?', 'This action cannot be undone.', [
      {
        style: 'cancel',
        text: 'Cancel',
      },
      {
        style: 'destructive',
        text: deleteMutation.isPending ? 'Deleting...' : 'Delete',
        onPress: () => {
          deleteMutation.mutate();
        },
      },
    ]);
  }

  if (issueQuery.isLoading) {
    return (
      <View style={styles.loadingState}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.loadingLabel}>Loading issue details...</Text>
      </View>
    );
  }

  if (issueQuery.isError || !issueQuery.data) {
    return (
      <View style={styles.loadingState}>
        <Text style={styles.notFoundTitle}>Issue not found</Text>
        <Text style={styles.notFoundDescription}>
          {issueQuery.isError
            ? getErrorMessage(issueQuery.error)
            : 'The issue is no longer available.'}
        </Text>
      </View>
    );
  }

  const issue = issueQuery.data;
  const badgeColors = statusColors[issue.status];

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
        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerCopy}>
              <Text style={styles.issueId}>Issue ID: {issue.id}</Text>
              <Text style={styles.title}>{issue.title}</Text>
              <Text style={styles.descriptionText}>
                Created {new Date(issue.createdAt).toLocaleString()}
              </Text>
              <Text style={styles.descriptionText}>
                Updated {new Date(issue.updatedAt).toLocaleString()}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: badgeColors.backgroundColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeLabel,
                  {
                    color: badgeColors.textColor,
                  },
                ]}
              >
                {statusLabels[issue.status]}
              </Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              onPress={() => {
                if (isEditing) {
                  reset(toUpdateIssueFormValues(issue));
                  setIsEditing(false);
                  return;
                }

                setIsEditing(true);
              }}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed ? styles.buttonPressed : null,
              ]}
            >
              <Text style={styles.secondaryButtonLabel}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </Pressable>

            <Pressable
              disabled={deleteMutation.isPending}
              onPress={confirmDelete}
              style={({ pressed }) => [
                styles.ghostDangerButton,
                deleteMutation.isPending ? styles.buttonDisabled : null,
                pressed && !deleteMutation.isPending ? styles.buttonPressed : null,
              ]}
            >
              <Text style={styles.ghostDangerLabel}>Delete</Text>
            </Pressable>
          </View>
        </View>

        <IssueFormFields
          attachmentName={attachmentName || issue.attachmentName || ''}
          control={control}
          disabled={!isEditing}
          errors={errors}
          onPickAttachment={handlePickAttachment}
          showStatus
        />

        {isEditing ? (
          <Pressable
            disabled={!isDirty || updateMutation.isPending}
            onPress={onSubmit}
            style={({ pressed }) => [
              styles.primaryButton,
              !isDirty || updateMutation.isPending ? styles.buttonDisabled : null,
              pressed && isDirty && !updateMutation.isPending
                ? styles.buttonPressed
                : null,
            ]}
          >
            <Text style={styles.primaryButtonLabel}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    columnGap: 10,
    flexDirection: 'row',
    marginTop: 18,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  descriptionText: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 6,
  },
  ghostDangerButton: {
    alignItems: 'center',
    borderColor: colors.accent,
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  ghostDangerLabel: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 18,
    padding: 20,
  },
  headerCopy: {
    flex: 1,
    marginRight: 12,
  },
  headerTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  issueId: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  loadingLabel: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 12,
  },
  loadingState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  notFoundDescription: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  notFoundTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 999,
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  primaryButtonLabel: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.text,
    borderRadius: 999,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  secondaryButtonLabel: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '800',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  statusBadgeLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
    marginTop: 8,
  },
});
