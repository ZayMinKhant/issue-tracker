'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { startTransition, useDeferredValue, useEffect, useState, type ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Breadcrumb } from '@/app/common/breadcrumb';
import { ConfirmDialog } from '@/app/common/confirm-dialog';
import {
  createIssue,
  deleteIssue,
  getIssues,
  type CreateIssueInput,
  type Issue,
  type IssueCategory,
  type IssueStatus,
} from '@/lib/issues';
import { CreateIssueModal } from '@/app/components/issues/list/create-issue-modal';
import { IssuesFilters } from '@/app/components/issues/list/issues-filters';
import { IssuesTable } from '@/app/components/issues/list/issues-table';
import {
  createIssueSchema,
  type CreateIssueFormValues,
  getErrorMessage,
  getValidIssuePage,
  normalizeOptionalTextInput,
  normalizeFromDate,
  normalizeToDate,
  syncIssueDateRange,
} from '@/app/utils/issues-utils';

export default function IssuesPage() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'ALL'>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);
  const deferredSearch = useDeferredValue(searchInput.trim());

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateIssueFormValues>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      title: '',
      description: '',
      submitterName: '',
      category: 'GENERAL',
      attachmentName: '',
    },
  });

  const issuesQuery = useQuery({
    queryKey: ['issues', deferredSearch, statusFilter, categoryFilter, fromDate, toDate, page],
    queryFn: () =>
      getIssues({
        search: deferredSearch || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        category: categoryFilter === 'ALL' ? undefined : categoryFilter,
        from: normalizeFromDate(fromDate),
        to: normalizeToDate(toDate),
        page,
        limit: 5,
      }),
    placeholderData: keepPreviousData,
  });

  const issues = issuesQuery.data?.items ?? [];
  const meta = issuesQuery.data?.meta;
  const totalPages = Math.max(meta?.totalPages ?? 1, 1);
  const attachmentName = useWatch({
    control,
    name: 'attachmentName',
  });

  useEffect(() => {
    const nextPage = getValidIssuePage(page, meta?.totalPages);

    if (nextPage !== page) {
      startTransition(() => {
        setPage(nextPage);
      });
    }
  }, [meta?.totalPages, page]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateIssueInput) => createIssue(payload),
    onSuccess: (issue) => {
      reset({
        title: '',
        description: '',
        submitterName: '',
        category: 'GENERAL',
        attachmentName: '',
      });
      toast.success(`Issue "${issue.title}" created.`);
      setIsCreateOpen(false);
      startTransition(() => {
        setPage(1);
      });
      void queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteIssue(id),
    onSuccess: () => {
      toast.success('Issue deleted.');
      void queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
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

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setValue('attachmentName', file?.name ?? '', {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleFromDateChange = (value: string) => {
    const nextRange = syncIssueDateRange({ fromDate, toDate }, 'from', value);
    setFromDate(nextRange.fromDate);
    setToDate(nextRange.toDate);
  };

  const handleToDateChange = (value: string) => {
    const nextRange = syncIssueDateRange({ fromDate, toDate }, 'to', value);
    setFromDate(nextRange.fromDate);
    setToDate(nextRange.toDate);
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

  const hasFilters =
    Boolean(deferredSearch) ||
    statusFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    Boolean(fromDate) ||
    Boolean(toDate);

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
            categoryFilter={categoryFilter}
            clearDisabled={!hasFilters}
            fromDate={fromDate}
            onCategoryChange={setCategoryFilter}
            onClear={() => {
              setSearchInput('');
              setStatusFilter('ALL');
              setCategoryFilter('ALL');
              setFromDate('');
              setToDate('');
              setPage(1);
            }}
            onFromDateChange={handleFromDateChange}
            onResetPage={() => setPage(1)}
            onSearchChange={setSearchInput}
            onStatusChange={setStatusFilter}
            onToDateChange={handleToDateChange}
            searchInput={searchInput}
            statusFilter={statusFilter}
            toDate={toDate}
          />

          <IssuesTable
            errorMessage={issuesQuery.isError ? getErrorMessage(issuesQuery.error) : null}
            isError={issuesQuery.isError}
            isFetching={issuesQuery.isFetching}
            isLoading={issuesQuery.isLoading}
            issues={issues}
            deletingIssueId={deleteMutation.isPending ? issueToDelete?.id ?? null : null}
            onPageNext={() =>
              startTransition(() => {
                setPage((currentPage) => Math.min(currentPage + 1, totalPages));
              })
            }
            onPagePrevious={() =>
              startTransition(() => {
                setPage((currentPage) => Math.max(currentPage - 1, 1));
              })
            }
            onDeleteIssue={setIssueToDelete}
            page={meta?.page ?? 1}
            total={meta?.total ?? 0}
            totalPages={totalPages}
          />
        </div>
      </div>

      <CreateIssueModal
        attachmentName={attachmentName}
        errors={errors}
        isOpen={isCreateOpen}
        isSubmitting={createMutation.isPending}
        onClose={() => setIsCreateOpen(false)}
        onFileSelection={handleFileSelection}
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
