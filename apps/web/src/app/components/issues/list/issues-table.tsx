import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import type { Issue } from '@issue-tracker/types';
import { formatEnumLabel, statusLabels } from '@issue-tracker/utils';
import { Pagination } from '@/app/common/pagination';
import { statusClasses } from '@/app/utils/issues-utils';

interface IssuesTableProps {
  issues: Issue[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  isFetching: boolean;
  deletingIssueId: string | null;
  onPageNext: () => void;
  onPagePrevious: () => void;
  onDeleteIssue: (issue: Issue) => void;
}

export function IssuesTable({
  issues,
  total,
  page,
  totalPages,
  isLoading,
  isError,
  errorMessage,
  isFetching,
  deletingIssueId,
  onPageNext,
  onPagePrevious,
  onDeleteIssue,
}: IssuesTableProps) {
  const router = useRouter();

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white">
      <div className="hidden border-b border-[var(--line)] bg-[#fafbfd] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)] md:grid md:grid-cols-[1.1fr_2fr_1.2fr_1.2fr_1.4fr_1fr_72px] md:gap-4">
        <span>ID</span>
        <span>Title</span>
        <span>Submitter</span>
        <span>Category</span>
        <span>Created At</span>
        <span>Status</span>
        <span className="text-right">Action</span>
      </div>

      <div className="divide-y divide-[var(--line)]">
        {isLoading ? (
          <div className="px-4 py-6 text-sm text-[var(--muted)] sm:px-5">Loading issues...</div>
        ) : null}

        {isError ? (
          <div className="px-4 py-6 text-sm text-red-600 sm:px-5">{errorMessage}</div>
        ) : null}

        {!isLoading && issues.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-[var(--muted)] sm:px-5">
            No issues found for the current filters.
          </div>
        ) : null}

        {issues.map((issue) => {
          return (
            <div
              key={issue.id}
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/issues/${issue.id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  router.push(`/issues/${issue.id}`);
                }
              }}
              className="grid cursor-pointer gap-3 px-4 py-4 text-left transition hover:bg-[#fafbfd] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-inset sm:px-5 md:grid-cols-[1.1fr_2fr_1.2fr_1.2fr_1.4fr_1fr_72px] md:gap-4"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)] md:hidden">
                  ID
                </p>
                <p className="text-sm text-[var(--foreground)]">{issue.id}</p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)] md:hidden">
                  Title
                </p>
                <p className="text-sm font-medium text-[var(--foreground)]">{issue.title}</p>
                <p className="mt-1 line-clamp-1 text-xs text-[var(--muted)]">{issue.description}</p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)] md:hidden">
                  Submitter
                </p>
                <p className="text-sm text-[var(--foreground)]">{issue.submitterName || '-'}</p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)] md:hidden">
                  Category
                </p>
                <span className="inline-flex rounded-full bg-[#e9f3fc] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
                  {formatEnumLabel(issue.category)}
                </span>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)] md:hidden">
                  Created At
                </p>
                <p className="text-sm text-[var(--muted)]">
                  {format(new Date(issue.createdAt), 'dd/MM/yyyy HH:mm')}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)] md:hidden">
                  Status
                </p>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[issue.status]}`}
                >
                  {statusLabels[issue.status]}
                </span>
              </div>

              <div
                className="flex items-center gap-2 md:justify-end"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onDeleteIssue(issue)}
                  disabled={deletingIssueId === issue.id}
                  aria-label={`Delete issue ${issue.title}`}
                  title="Delete issue"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingIssueId === issue.id ? (
                    <span className="text-[10px] font-medium">...</span>
                  ) : (
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {deletingIssueId === issue.id ? 'Deleting issue' : 'Delete issue'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination
        currentPage={page}
        isBusy={isFetching}
        onNext={onPageNext}
        onPrevious={onPagePrevious}
        summary={`Showing ${issues.length} of ${total} issues`}
        totalPages={totalPages}
      />
    </section>
  );
}
