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

export interface IssueListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IssueListResponse {
  items: Issue[];
  meta: IssueListMeta;
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

export const ISSUE_SOCKET_EVENTS = {
  CREATED: 'issue.created',
  UPDATED: 'issue.updated',
  DELETED: 'issue.deleted',
} as const;

export type IssueSocketEventName =
  (typeof ISSUE_SOCKET_EVENTS)[keyof typeof ISSUE_SOCKET_EVENTS];

export interface IssueDeletedPayload {
  id: string;
}

export interface IssueSocketEventPayloads {
  [ISSUE_SOCKET_EVENTS.CREATED]: Issue;
  [ISSUE_SOCKET_EVENTS.UPDATED]: Issue;
  [ISSUE_SOCKET_EVENTS.DELETED]: IssueDeletedPayload;
}
