import type { IssueStatus } from '@issue-tracker/types';

export const statusClasses: Record<IssueStatus, string> = {
  REPORTED: 'bg-slate-100 text-slate-600',
  IN_PROGRESS: 'bg-red-100 text-red-600',
  SOLVED: 'bg-emerald-100 text-emerald-600',
};
