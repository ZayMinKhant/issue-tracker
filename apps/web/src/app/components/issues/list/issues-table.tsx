import type { ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
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

interface DeleteIssueButtonProps {
  issue: Issue;
  deletingIssueId: string | null;
  onDeleteIssue: (issue: Issue) => void;
}

const desktopHeaders = ['ID', 'Title', 'Submitter', 'Category', 'Created At', 'Status', 'Action'];

function DeleteIssueButton({
  issue,
  deletingIssueId,
  onDeleteIssue,
}: DeleteIssueButtonProps) {
  const isDeleting = deletingIssueId === issue.id;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onDeleteIssue(issue);
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
      }}
      disabled={isDeleting}
      aria-label={`Delete issue ${issue.title}`}
      title="Delete issue"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isDeleting ? (
        <span className="text-[10px] font-medium">...</span>
      ) : (
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only">{isDeleting ? 'Deleting issue' : 'Delete issue'}</span>
    </button>
  );
}

function MobileLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">{children}</p>
  );
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
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full table-fixed border-collapse">
          <thead className="border-b border-[var(--line)] bg-[#fafbfd]">
            <tr>
              {desktopHeaders.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)] ${
                    header === 'ID'
                      ? 'w-[12rem]'
                      : header === 'Submitter'
                        ? 'w-[10rem]'
                        : header === 'Category'
                          ? 'w-[9rem]'
                          : header === 'Created At'
                            ? 'w-[11rem]'
                            : header === 'Status'
                              ? 'w-[8rem]'
                              : header === 'Action'
                                ? 'w-[72px] text-right'
                                : ''
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={desktopHeaders.length} className="px-5 py-6 text-sm text-[var(--muted)]">
                  Loading issues...
                </td>
              </tr>
            ) : null}

            {isError ? (
              <tr>
                <td colSpan={desktopHeaders.length} className="px-5 py-6 text-sm text-red-600">
                  {errorMessage}
                </td>
              </tr>
            ) : null}

            {!isLoading && !isError && issues.length === 0 ? (
              <tr>
                <td
                  colSpan={desktopHeaders.length}
                  className="px-5 py-10 text-center text-sm text-[var(--muted)]"
                >
                  No issues found for the current filters.
                </td>
              </tr>
            ) : null}

            {!isLoading && !isError
              ? issues.map((issue) => (
                  <tr key={issue.id} className="border-b border-[var(--line)] last:border-b-0">
                    <td className="px-5 py-4 align-top text-sm text-[var(--foreground)]">{issue.id}</td>
                    <td className="px-5 py-4 align-top">
                      <Link
                        href={`/issues/${issue.id}`}
                        className="block rounded-sm text-sm font-medium text-[var(--foreground)] transition hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      >
                        {issue.title}
                      </Link>
                      <p className="mt-1 line-clamp-1 text-xs text-[var(--muted)]">
                        {issue.description}
                      </p>
                    </td>
                    <td className="px-5 py-4 align-top text-sm text-[var(--foreground)]">
                      {issue.submitterName || '-'}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="inline-flex rounded-full bg-[#e9f3fc] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
                        {formatEnumLabel(issue.category)}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top text-sm text-[var(--muted)]">
                      {format(new Date(issue.createdAt), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[issue.status]}`}
                      >
                        {statusLabels[issue.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right align-top">
                      <DeleteIssueButton
                        issue={issue}
                        deletingIssueId={deletingIssueId}
                        onDeleteIssue={onDeleteIssue}
                      />
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      <div className="md:hidden">
        {isLoading ? (
          <div className="px-4 py-6 text-sm text-[var(--muted)] sm:px-5">Loading issues...</div>
        ) : null}

        {isError ? (
          <div className="px-4 py-6 text-sm text-red-600 sm:px-5">{errorMessage}</div>
        ) : null}

        {!isLoading && !isError && issues.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-[var(--muted)] sm:px-5">
            No issues found for the current filters.
          </div>
        ) : null}

        {!isLoading && !isError
          ? (
            <div className="space-y-3 p-3">
              {issues.map((issue) => (
                <article
                  key={issue.id}
                  className="rounded-xl border border-[var(--line)] bg-[#fcfdff] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
                >
                  <div>
                    <MobileLabel>Title</MobileLabel>
                    <Link
                      href={`/issues/${issue.id}`}
                      className="mt-1 block rounded-sm text-sm font-medium text-[var(--foreground)] transition hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      {issue.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">{issue.description}</p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <MobileLabel>ID</MobileLabel>
                      <p className="text-sm text-[var(--foreground)]">{issue.id}</p>
                    </div>

                    <div>
                      <MobileLabel>Submitter</MobileLabel>
                      <p className="text-sm text-[var(--foreground)]">{issue.submitterName || '-'}</p>
                    </div>

                    <div>
                      <MobileLabel>Category</MobileLabel>
                      <span className="inline-flex rounded-full bg-[#e9f3fc] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
                        {formatEnumLabel(issue.category)}
                      </span>
                    </div>

                    <div>
                      <MobileLabel>Status</MobileLabel>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[issue.status]}`}
                      >
                        {statusLabels[issue.status]}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <MobileLabel>Created At</MobileLabel>
                      <p className="text-sm text-[var(--muted)]">
                        {format(new Date(issue.createdAt), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <DeleteIssueButton
                        issue={issue}
                        deletingIssueId={deletingIssueId}
                        onDeleteIssue={onDeleteIssue}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )
          : null}
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
