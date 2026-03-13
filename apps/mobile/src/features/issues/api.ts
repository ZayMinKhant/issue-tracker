import type {
  CreateIssueInput,
  Issue,
  IssueListResponse,
  IssueQuery,
  UpdateIssueInput,
} from '@issue-tracker/types';
import axios from 'axios';
import { getApiBaseUrl } from '../../config/environment';

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function compactParams(query: IssueQuery) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ''),
  );
}

export async function getIssues(query: IssueQuery) {
  const response = await api.get<IssueListResponse>('/issues', {
    params: compactParams(query),
  });

  return response.data;
}

export async function getIssue(id: string) {
  const response = await api.get<Issue>(`/issues/${id}`);
  return response.data;
}

export async function createIssue(payload: CreateIssueInput) {
  const response = await api.post<Issue>('/issues', payload);
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
