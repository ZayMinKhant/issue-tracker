import { AxiosError } from 'axios';
import { z } from 'zod';
import { ISSUE_CATEGORIES, type Issue, type IssueStatus } from '@/lib/issues';

export const createIssueSchema = z.object({
  title: z.string().trim().min(3, 'Use at least 3 characters.'),
  description: z.string().trim().min(10, 'Add enough detail to route the issue.'),
  submitterName: z.string().trim(),
  category: z.enum(ISSUE_CATEGORIES),
  attachmentName: z.string().trim().optional(),
});

export type CreateIssueFormValues = z.infer<typeof createIssueSchema>;

export const updateIssueSchema = createIssueSchema.extend({
  status: z.enum(['REPORTED', 'IN_PROGRESS', 'SOLVED']),
});

export type UpdateIssueFormValues = z.infer<typeof updateIssueSchema>;

export const statusLabels: Record<IssueStatus, string> = {
  REPORTED: 'Reported',
  IN_PROGRESS: 'In Progress',
  SOLVED: 'Solved',
};

export const statusClasses: Record<IssueStatus, string> = {
  REPORTED: 'bg-slate-100 text-slate-600',
  IN_PROGRESS: 'bg-red-100 text-red-600',
  SOLVED: 'bg-emerald-100 text-emerald-600',
};

export function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const responseMessage = error.response?.data?.message;

    if (Array.isArray(responseMessage)) {
      return responseMessage.join(', ');
    }

    return responseMessage?.toString() || error.message || 'The request failed.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong.';
}

export function normalizeFromDate(value: string) {
  return value ? `${value}T00:00:00.000Z` : undefined;
}

export function normalizeToDate(value: string) {
  return value ? `${value}T23:59:59.999Z` : undefined;
}

export function normalizeOptionalTextInput(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function getValidIssuePage(page: number, totalPages?: number) {
  const safePage = Math.max(page, 1);
  const safeTotalPages = Math.max(totalPages ?? 1, 1);

  return Math.min(safePage, safeTotalPages);
}

export function syncIssueDateRange(
  currentRange: { fromDate: string; toDate: string },
  field: 'from' | 'to',
  value: string,
) {
  if (field === 'from') {
    return {
      fromDate: value,
      toDate:
        value && currentRange.toDate && value > currentRange.toDate
          ? value
          : currentRange.toDate,
    };
  }

  return {
    fromDate:
      value && currentRange.fromDate && value < currentRange.fromDate
        ? value
        : currentRange.fromDate,
    toDate: value,
  };
}

export function toUpdateIssueFormValues(issue: Issue): UpdateIssueFormValues {
  return {
    title: issue.title,
    description: issue.description,
    submitterName: issue.submitterName ?? '',
    category: issue.category,
    status: issue.status,
    attachmentName: issue.attachmentName ?? '',
  };
}
