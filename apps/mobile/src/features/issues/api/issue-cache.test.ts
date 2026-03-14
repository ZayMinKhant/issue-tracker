import type { Issue } from '@issue-tracker/types';
import { QueryClient } from '@tanstack/react-query';
import {
  handleIssueCreatedEvent,
  handleIssueDeletedEvent,
  handleIssueUpdatedEvent,
} from './issue-cache';
import { issueKeys } from './query-keys';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        retry: false,
      },
    },
  });
}

function createIssue(overrides: Partial<Issue> = {}): Issue {
  return {
    attachmentName: null,
    category: 'MAINTENANCE',
    createdAt: '2026-03-13T10:00:00.000Z',
    description: 'The lobby light is out and needs repair.',
    id: 'issue-1',
    status: 'REPORTED',
    submitterName: 'Front desk',
    title: 'Lobby light out',
    updatedAt: '2026-03-13T10:00:00.000Z',
    ...overrides,
  };
}

describe('issue realtime cache handlers', () => {
  it('updates the detail cache and invalidates issue lists when an issue is created', async () => {
    const queryClient = createQueryClient();
    const issue = createIssue();
    const listKey = issueKeys.list({ limit: 5, page: 1 });

    queryClient.setQueryData(listKey, {
      items: [],
      meta: {
        limit: 5,
        page: 1,
        total: 0,
        totalPages: 1,
      },
    });

    handleIssueCreatedEvent(queryClient, issue);
    await Promise.resolve();

    expect(queryClient.getQueryData(issueKeys.detail(issue.id))).toEqual(issue);
    expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true);
    queryClient.clear();
  });

  it('replaces the detail cache when an issue is updated', async () => {
    const queryClient = createQueryClient();
    const issue = createIssue();
    const updatedIssue = createIssue({
      status: 'SOLVED',
      title: 'Lobby light fixed',
    });
    const listKey = issueKeys.list({ limit: 5, page: 1 });

    queryClient.setQueryData(issueKeys.detail(issue.id), issue);
    queryClient.setQueryData(listKey, {
      items: [issue],
      meta: {
        limit: 5,
        page: 1,
        total: 1,
        totalPages: 1,
      },
    });

    handleIssueUpdatedEvent(queryClient, updatedIssue);
    await Promise.resolve();

    expect(queryClient.getQueryData(issueKeys.detail(issue.id))).toEqual(updatedIssue);
    expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true);
    queryClient.clear();
  });

  it('nulls the detail cache and invalidates issue lists when an issue is deleted', async () => {
    const queryClient = createQueryClient();
    const issue = createIssue();
    const listKey = issueKeys.list({ limit: 5, page: 1 });

    queryClient.setQueryData(issueKeys.detail(issue.id), issue);
    queryClient.setQueryData(listKey, {
      items: [issue],
      meta: {
        limit: 5,
        page: 1,
        total: 1,
        totalPages: 1,
      },
    });

    handleIssueDeletedEvent(queryClient, { id: issue.id });
    await Promise.resolve();

    expect(queryClient.getQueryData(issueKeys.detail(issue.id))).toBeNull();
    expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true);
    queryClient.clear();
  });
});
