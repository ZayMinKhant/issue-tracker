import { startTransition } from 'react';
import { Search } from 'lucide-react';
import { ISSUE_CATEGORIES, ISSUE_STATUSES, type IssueCategory, type IssueStatus } from '@issue-tracker/types';
import { formatEnumLabel, statusLabels } from '@issue-tracker/utils';

interface IssuesFiltersProps {
  categoryFilter: IssueCategory | 'ALL';
  clearDisabled: boolean;
  fromDate: string;
  searchInput: string;
  statusFilter: IssueStatus | 'ALL';
  toDate: string;
  onCategoryChange: (value: IssueCategory | 'ALL') => void;
  onClear: () => void;
  onFromDateChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: IssueStatus | 'ALL') => void;
  onToDateChange: (value: string) => void;
  onResetPage: () => void;
}

export function IssuesFilters({
  categoryFilter,
  clearDisabled,
  fromDate,
  searchInput,
  statusFilter,
  toDate,
  onCategoryChange,
  onClear,
  onFromDateChange,
  onSearchChange,
  onStatusChange,
  onToDateChange,
  onResetPage,
}: IssuesFiltersProps) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white p-4 sm:p-5">
      <label className="grid gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Search
        </span>
        <div className="relative">
          <input
            aria-label="Search issues"
            value={searchInput}
            onChange={(event) => {
              onSearchChange(event.target.value);
              startTransition(onResetPage);
            }}
            placeholder="Search..."
            className="h-11 w-full rounded-md border border-[var(--line)] bg-[#fbfcfe] px-4 pr-12 text-sm outline-none transition focus:border-[var(--accent)]"
          />
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
          />
        </div>
      </label>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-[180px_180px_200px_220px_1fr]">
        <label className="grid gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            From Date
          </span>
          <input
            type="date"
            aria-label="From date"
            max={toDate || undefined}
            value={fromDate}
            onChange={(event) => {
              onFromDateChange(event.target.value);
              startTransition(onResetPage);
            }}
            className="h-11 rounded-md border border-[var(--line)] bg-[#fbfcfe] px-3 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            To Date
          </span>
          <input
            type="date"
            aria-label="To date"
            min={fromDate || undefined}
            value={toDate}
            onChange={(event) => {
              onToDateChange(event.target.value);
              startTransition(onResetPage);
            }}
            className="h-11 rounded-md border border-[var(--line)] bg-[#fbfcfe] px-3 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Status
          </span>
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => {
              onStatusChange(event.target.value as IssueStatus | 'ALL');
              startTransition(onResetPage);
            }}
            className="h-11 rounded-md border border-[var(--line)] bg-[#fbfcfe] px-3 text-sm outline-none transition focus:border-[var(--accent)]"
          >
            <option value="ALL">All Statuses</option>
            {ISSUE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Issue Type
          </span>
          <select
            aria-label="Filter by issue type"
            value={categoryFilter}
            onChange={(event) => {
              onCategoryChange(event.target.value as IssueCategory | 'ALL');
              startTransition(onResetPage);
            }}
            className="h-11 rounded-md border border-[var(--line)] bg-[#fbfcfe] px-3 text-sm outline-none transition focus:border-[var(--accent)]"
          >
            <option value="ALL">All Issue Types</option>
            {ISSUE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {formatEnumLabel(category)}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end justify-end">
          <button
            type="button"
            onClick={onClear}
            disabled={clearDisabled}
            className="h-11 rounded-md border border-[var(--line)] px-4 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </section>
  );
}
