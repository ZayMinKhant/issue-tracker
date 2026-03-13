import { api } from '@/lib/api';

export const ISSUE_CATEGORIES = [
  'GENERAL',
  'MAINTENANCE',
  'SECURITY',
  'CLEANING',
  'NOISE',
  'PARKING',
] as const;

export const ISSUE_STATUSES = ['REPORTED', 'IN_PROGRESS', 'SOLVED'] as const;

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];
export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export interface Issue {
  id: string;
  title: string;
  description: string;
  submitterName: string | null;
  category: IssueCategory;
  status: IssueStatus;
  attachmentName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IssueListResponse {
  items: Issue[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IssueQuery {
  search?: string;
  status?: IssueStatus;
  category?: IssueCategory;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface CreateIssueInput {
  title: string;
  description: string;
  submitterName?: string;
  category: IssueCategory;
  attachmentName?: string;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  submitterName?: string | null;
  category?: IssueCategory;
  status?: IssueStatus;
  attachmentName?: string;
}

export async function getIssues(query: IssueQuery) {
  const response = await api.get<IssueListResponse>('/issues', {
    params: Object.fromEntries(
      Object.entries(query).filter(([, value]) => value !== undefined && value !== ''),
    ),
  });

  return response.data;
}

export async function createIssue(payload: CreateIssueInput) {
  const response = await api.post<Issue>('/issues', payload);
  return response.data;
}

export async function getIssue(id: string) {
  const response = await api.get<Issue>(`/issues/${id}`);
  return response.data;
}

export async function updateIssue(id: string, payload: UpdateIssueInput) {
  const response = await api.patch<Issue>(`/issues/${id}`, payload);
  return response.data;
}

export async function deleteIssue(id: string) {
  const response = await api.delete<{ id: string; deleted: true }>(`/issues/${id}`);
  return response.data;
}
