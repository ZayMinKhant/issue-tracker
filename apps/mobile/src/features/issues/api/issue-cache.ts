import { QueryClient } from '@tanstack/react-query';
import type { Issue, IssueDeletedPayload } from '@issue-tracker/types';
import { issueKeys } from './query-keys';

function upsertIssueCache(queryClient: QueryClient, issue: Issue) {
  queryClient.setQueryData(issueKeys.detail(issue.id), issue);
  void queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
}

export function handleIssueCreatedEvent(queryClient: QueryClient, issue: Issue) {
  upsertIssueCache(queryClient, issue);
}

export function handleIssueUpdatedEvent(queryClient: QueryClient, issue: Issue) {
  upsertIssueCache(queryClient, issue);
}

export function handleIssueDeletedEvent(
  queryClient: QueryClient,
  payload: IssueDeletedPayload,
) {
  queryClient.setQueryData(issueKeys.detail(payload.id), null);
  void queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
}
