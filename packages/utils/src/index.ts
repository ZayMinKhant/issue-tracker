import { AxiosError } from 'axios';
import { z } from 'zod';
import {
  ISSUE_CATEGORIES,
  ISSUE_STATUSES,
  type CreateIssueInput,
  type Issue,
  type IssueListResponse,
  type IssueQuery,
  type IssueStatus,
  type UpdateIssueInput,
} from '@issue-tracker/types';

const issueTitleSchema = z
  .string()
  .trim()
  .min(3, 'Use at least 3 characters.');
const issueDescriptionSchema = z
  .string()
  .trim()
  .min(10, 'Add enough detail to route the issue.');
const issueCategorySchema = z.enum(ISSUE_CATEGORIES);
const issueStatusSchema = z.enum(ISSUE_STATUSES);
const formOptionalTextSchema = z.string().trim();
const createOptionalInputTextSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));
const updateOptionalInputTextSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }

    return value ? value : null;
  });

export const createIssueSchema = z.object({
  title: issueTitleSchema,
  description: issueDescriptionSchema,
  submitterName: formOptionalTextSchema,
  category: issueCategorySchema,
  attachmentName: formOptionalTextSchema.optional(),
});

export type CreateIssueFormValues = z.infer<typeof createIssueSchema>;

export const updateIssueSchema = createIssueSchema.extend({
  status: issueStatusSchema,
});

export type UpdateIssueFormValues = z.infer<typeof updateIssueSchema>;

export const createIssueDtoSchema = z.object({
  title: issueTitleSchema,
  description: issueDescriptionSchema,
  submitterName: createOptionalInputTextSchema,
  category: issueCategorySchema,
  attachmentName: createOptionalInputTextSchema,
});

export const updateIssueDtoSchema = z.object({
  title: issueTitleSchema.optional(),
  description: issueDescriptionSchema.optional(),
  submitterName: updateOptionalInputTextSchema,
  category: issueCategorySchema.optional(),
  status: issueStatusSchema.optional(),
  attachmentName: createOptionalInputTextSchema,
});

export const queryIssueSchema = z.object({
  search: z.string().trim().optional(),
  status: issueStatusSchema.optional(),
  category: issueCategorySchema.optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export type QueryIssueValues = z.infer<typeof queryIssueSchema>;

export const queryIssueDtoSchema = queryIssueSchema;

export const statusLabels: Record<IssueStatus, string> = {
  REPORTED: 'Reported',
  IN_PROGRESS: 'In Progress',
  SOLVED: 'Solved',
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

export function compactParams(query: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ''),
  );
}

export type { AxiosInstance } from 'axios';

export function createIssueApi(api: { get: Function; post: Function; patch: Function; delete: Function }) {
  return {
    getIssues: async (query: IssueQuery) => {
      const response = await (api.get as Function)('/issues', {
        params: compactParams(query as unknown as Record<string, unknown>),
      });
      return (response as { data: IssueListResponse }).data;
    },
    getIssue: async (id: string) => {
      const response = await (api.get as Function)(`/issues/${id}`);
      return (response as { data: Issue }).data;
    },
    createIssue: async (payload: CreateIssueInput) => {
      const response = await (api.post as Function)('/issues', payload);
      return (response as { data: Issue }).data;
    },
    updateIssue: async (id: string, payload: UpdateIssueInput) => {
      const response = await (api.patch as Function)(`/issues/${id}`, payload);
      return (response as { data: Issue }).data;
    },
    deleteIssue: async (id: string) => {
      const response = await (api.delete as Function)(`/issues/${id}`);
      return (response as { data: { id: string; deleted: true } }).data;
    },
  };
}
