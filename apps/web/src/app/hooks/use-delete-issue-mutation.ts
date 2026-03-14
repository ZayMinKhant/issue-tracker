'use client';

import { getErrorMessage } from '@issue-tracker/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteIssue } from '@/lib/issues';
import { issueKeys } from '@/lib/query-keys';

export function useDeleteIssueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteIssue(id),
    onSuccess: () => {
      toast.success('Issue deleted.');
      void queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
