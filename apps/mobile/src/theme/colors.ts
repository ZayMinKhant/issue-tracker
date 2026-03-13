import type { IssueStatus } from '@issue-tracker/types';

export const colors = {
  background: '#F4F6F9',
  surface: '#FFFFFF',
  surfaceMuted: '#FBFCFE',
  text: '#2D3748',
  muted: '#8A94A6',
  line: '#E5E9F0',
  accent: '#5B9BD5',
  accentMuted: '#EFF6FD',
  success: '#059669',
  successMuted: '#D1FAE5',
  warning: '#DC2626',
  warningMuted: '#FEE2E2',
  info: '#5B9BD5',
  infoMuted: '#EFF6FD',
  shadow: 'rgba(45, 55, 72, 0.08)',
} as const;

export const statusColors: Record<
  IssueStatus,
  { backgroundColor: string; textColor: string }
> = {
  REPORTED: {
    backgroundColor: '#F1F5F9',
    textColor: '#475569',
  },
  IN_PROGRESS: {
    backgroundColor: '#FEE2E2',
    textColor: '#DC2626',
  },
  SOLVED: {
    backgroundColor: '#D1FAE5',
    textColor: '#059669',
  },
};
