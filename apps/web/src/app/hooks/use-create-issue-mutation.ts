'use client';

import type { CreateIssueInput } from '@issue-tracker/types';
import { getErrorMessage, type CreateIssueFormValues } from '@issue-tracker/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createIssue } from '@/lib/issues';
import { issueKeys } from '@/lib/query-keys';

export const CREATE_ISSUE_DEFAULTS: CreateIssueFormValues = {
  title: '',
  description: '',
  submitterName: '',
  category: 'GENERAL',
  attachmentName: '',
};

export function useCreateIssueMutation(callbacks: {
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateIssueInput) => createIssue(payload),
    onSuccess: (issue) => {
      toast.success(`Issue "${issue.title}" created.`);
      callbacks.onSuccess();
      void queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
