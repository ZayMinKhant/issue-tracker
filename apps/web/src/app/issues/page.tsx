'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Issue } from '@issue-tracker/types';
import {
  createIssueSchema,
  type CreateIssueFormValues,
  normalizeOptionalTextInput,
  getErrorMessage,
} from '@issue-tracker/utils';
import { startTransition, useState, type ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Breadcrumb } from '@/app/common/breadcrumb';
import { ConfirmDialog } from '@/app/common/confirm-dialog';
import { CreateIssueModal } from '@/app/components/issues/list/create-issue-modal';
import { IssuesFilters } from '@/app/components/issues/list/issues-filters';
import { IssuesTable } from '@/app/components/issues/list/issues-table';
import { useIssueListFilters } from '@/app/hooks/use-issue-list-filters';
import {
  CREATE_ISSUE_DEFAULTS,
  useCreateIssueMutation,
} from '@/app/hooks/use-create-issue-mutation';
import { useDeleteIssueMutation } from '@/app/hooks/use-delete-issue-mutation';
import { handleFileSelection } from '@/app/utils/file-selection';

export default function IssuesPage() {
  const filters = useIssueListFilters();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateIssueFormValues>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: CREATE_ISSUE_DEFAULTS,
  });

  const createMutation = useCreateIssueMutation({
    onSuccess: () => {
      reset(CREATE_ISSUE_DEFAULTS);
      setIsCreateOpen(false);
      startTransition(() => {
        filters.setPage(1);
      });
    },
  });

  const deleteMutation = useDeleteIssueMutation();

  const attachmentName = useWatch({
    control,
    name: 'attachmentName',
  });

  const onSubmit = handleSubmit((values) => {
    createMutation.mutate({
      title: values.title,
      description: values.description,
      category: values.category,
      submitterName: normalizeOptionalTextInput(values.submitterName),
      attachmentName: values.attachmentName || undefined,
    });
  });

  const onFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(event, setValue);
  };

  const handleDeleteConfirm = () => {
    if (!issueToDelete || deleteMutation.isPending) {
      return;
    }

    deleteMutation.mutate(issueToDelete.id, {
      onSuccess: () => {
        setIssueToDelete(null);
      },
      onError: () => {
        setIssueToDelete(null);
      },
    });
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)]">
                Issues
              </h1>
              <Breadcrumb items={[{ href: '/', label: 'Home' }, { label: 'Issues' }]} />
            </div>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-sm font-medium text-white transition hover:brightness-95"
            >
              Add New Issue
            </button>
          </div>

          <div className="border-b border-[var(--line)]">
            <div className="flex items-center gap-6 text-sm">
              <button
                type="button"
                className="border-b-2 border-[var(--accent)] px-1 py-3 font-medium text-[var(--accent)]"
              >
                Issue
              </button>
              <button type="button" className="px-1 py-3 text-[var(--muted)]" disabled>
                Issue Category
              </button>
            </div>
          </div>

          <IssuesFilters
            categoryFilter={filters.categoryFilter}
            clearDisabled={!filters.hasFilters}
            fromDate={filters.fromDate}
            onCategoryChange={filters.setCategoryFilter}
            onClear={filters.clearFilters}
            onFromDateChange={filters.handleFromDateChange}
            onResetPage={() => filters.setPage(1)}
            onSearchChange={filters.setSearchInput}
            onStatusChange={filters.setStatusFilter}
            onToDateChange={filters.handleToDateChange}
            searchInput={filters.searchInput}
            statusFilter={filters.statusFilter}
            toDate={filters.toDate}
          />

          <IssuesTable
            errorMessage={filters.issuesQuery.isError ? getErrorMessage(filters.issuesQuery.error) : null}
            isError={filters.issuesQuery.isError}
            isFetching={filters.issuesQuery.isFetching}
            isLoading={filters.issuesQuery.isLoading}
            issues={filters.issues}
            deletingIssueId={deleteMutation.isPending ? issueToDelete?.id ?? null : null}
            onPageNext={() =>
              startTransition(() => {
                filters.setPage((currentPage) => Math.min(currentPage + 1, filters.totalPages));
              })
            }
            onPagePrevious={() =>
              startTransition(() => {
                filters.setPage((currentPage) => Math.max(currentPage - 1, 1));
              })
            }
            onDeleteIssue={setIssueToDelete}
            page={filters.meta?.page ?? 1}
            total={filters.meta?.total ?? 0}
            totalPages={filters.totalPages}
          />
        </div>
      </div>

      <CreateIssueModal
        attachmentName={attachmentName}
        errors={errors}
        isOpen={isCreateOpen}
        isSubmitting={createMutation.isPending}
        onClose={() => setIsCreateOpen(false)}
        onFileSelection={onFileSelection}
        onSubmit={onSubmit}
        register={register}
      />

      <ConfirmDialog
        confirmLabel="Delete"
        description={
          issueToDelete
            ? `This will permanently delete "${issueToDelete.title}".`
            : ''
        }
        isDestructive
        isLoading={deleteMutation.isPending}
        isOpen={Boolean(issueToDelete)}
        onCancel={() => setIssueToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete issue?"
      />
    </main>
  );
}
