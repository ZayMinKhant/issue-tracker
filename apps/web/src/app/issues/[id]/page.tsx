'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Issue } from '@issue-tracker/types';
import {
  getErrorMessage,
  normalizeOptionalTextInput,
  toUpdateIssueFormValues,
  updateIssueSchema,
  type UpdateIssueFormValues,
} from '@issue-tracker/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, type ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { IssueAttachmentSection } from '@/app/components/issues/detail/issue-attachment-section';
import { IssueDetailForm } from '@/app/components/issues/detail/issue-detail-form';
import { IssueDetailHeader } from '@/app/components/issues/detail/issue-detail-header';
import { ConfirmDialog } from '@/app/common/confirm-dialog';
import { useDeleteIssueMutation } from '@/app/hooks/use-delete-issue-mutation';
import { handleFileSelection } from '@/app/utils/file-selection';
import { deleteIssue, getIssue, updateIssue } from '@/lib/issues';
import { issueKeys } from '@/lib/query-keys';

export default function IssueDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const issueId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<UpdateIssueFormValues>({
    resolver: zodResolver(updateIssueSchema),
    defaultValues: {
      title: '',
      description: '',
      submitterName: '',
      category: 'GENERAL',
      status: 'REPORTED',
      attachmentName: '',
    },
  });

  const issueQuery = useQuery({
    queryKey: issueKeys.detail(issueId),
    queryFn: () => getIssue(issueId),
    enabled: Boolean(issueId),
  });

  useEffect(() => {
    if (!issueQuery.data) {
      return;
    }

    reset(toUpdateIssueFormValues(issueQuery.data));
  }, [issueQuery.data, reset]);

  const updateMutation = useMutation({
    mutationFn: (values: UpdateIssueFormValues) =>
      updateIssue(issueId, {
        title: values.title,
        description: values.description,
        category: values.category,
        status: values.status,
        submitterName: normalizeOptionalTextInput(values.submitterName) ?? null,
        attachmentName: values.attachmentName || undefined,
      }),
    onSuccess: (issue) => {
      toast.success(`Issue "${issue.title}" updated.`);
      setIsEditing(false);
      void queryClient.invalidateQueries({ queryKey: issueKeys.detail(issueId) });
      void queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteIssue(issueId),
    onSuccess: () => {
      toast.success('Issue deleted.');
      void queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      router.push('/issues');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
      setIsDeleteOpen(false);
    },
  });

  const attachmentName = useWatch({
    control,
    name: 'attachmentName',
  });

  const onFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(event, setValue);
  };

  const handleCancelEdit = () => {
    if (issueQuery.data) {
      reset(toUpdateIssueFormValues(issueQuery.data));
    }

    setIsEditing(false);
  };

  const onSubmit = handleSubmit((values) => {
    updateMutation.mutate(values);
  });

  if (issueQuery.isLoading) {
    return (
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-[var(--line)] bg-white px-6 py-10 text-sm text-[var(--muted)]">
          Loading issue details...
        </div>
      </main>
    );
  }

  if (issueQuery.isError || !issueQuery.data) {
    return (
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-[var(--line)] bg-white px-6 py-10">
          <p className="text-lg font-medium text-[var(--foreground)]">Issue not found</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {issueQuery.isError ? getErrorMessage(issueQuery.error) : 'The issue could not be loaded.'}
          </p>
          <Link
            href="/issues"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--line)] px-4 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>
        </div>
      </main>
    );
  }

  const issue = issueQuery.data;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6">
          <IssueDetailHeader onDelete={() => setIsDeleteOpen(true)} />

          <IssueDetailForm
            errors={errors}
            isDirty={isDirty}
            isEditing={isEditing}
            isSaving={updateMutation.isPending}
            issue={issue}
            onCancelEdit={handleCancelEdit}
            onStartEdit={() => setIsEditing(true)}
            onSubmit={onSubmit}
            register={register}
          />

          <IssueAttachmentSection
            attachmentName={attachmentName || issue.attachmentName}
            isEditing={isEditing}
            onFileSelection={onFileSelection}
          />
        </div>
      </div>

      <ConfirmDialog
        confirmLabel="Delete"
        description={`This will permanently delete "${issue.title}".`}
        isDestructive
        isLoading={deleteMutation.isPending}
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete issue?"
      />
    </main>
  );
}
