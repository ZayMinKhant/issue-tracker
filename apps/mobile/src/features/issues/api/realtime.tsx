import {
  ISSUE_SOCKET_EVENTS,
  type Issue,
  type IssueDeletedPayload,
} from '@issue-tracker/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { getSocketBaseUrl } from '../../../config/environment';
import {
  handleIssueCreatedEvent,
  handleIssueDeletedEvent,
  handleIssueUpdatedEvent,
} from './issue-cache';

export function IssuesRealtimeBridge() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(getSocketBaseUrl(), {
      transports: ['websocket'],
    });

    socket.on(ISSUE_SOCKET_EVENTS.CREATED, (issue: Issue) => {
      handleIssueCreatedEvent(queryClient, issue);
    });

    socket.on(ISSUE_SOCKET_EVENTS.UPDATED, (issue: Issue) => {
      handleIssueUpdatedEvent(queryClient, issue);
    });

    socket.on(ISSUE_SOCKET_EVENTS.DELETED, (payload: IssueDeletedPayload) => {
      handleIssueDeletedEvent(queryClient, payload);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return null;
}
