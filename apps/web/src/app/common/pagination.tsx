import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  isBusy?: boolean;
  onNext: () => void;
  onPrevious: () => void;
  summary: string;
  totalPages: number;
}

export function Pagination({
  currentPage,
  isBusy = false,
  onNext,
  onPrevious,
  summary,
  totalPages,
}: PaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-[var(--line)] px-4 py-4 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p>{summary}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentPage <= 1 || isBusy}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--line)] px-3 py-2 text-[var(--foreground)] transition hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="px-2">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={currentPage >= totalPages || isBusy}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--line)] px-3 py-2 text-[var(--foreground)] transition hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
