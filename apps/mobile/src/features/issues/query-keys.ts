import type { IssueQuery } from '@issue-tracker/types';

export const issueKeys = {
  all: ['issues'] as const,
  lists: () => ['issues', 'list'] as const,
  list: (query: IssueQuery) => ['issues', 'list', query] as const,
  detail: (issueId: string) => ['issue', 'detail', issueId] as const,
};
