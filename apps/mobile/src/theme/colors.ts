import type { IssueStatus } from '@issue-tracker/types';

export const colors = {
  background: '#F4EEE6',
  surface: '#FFFDF9',
  surfaceMuted: '#F8F3EB',
  text: '#1F2933',
  muted: '#52606D',
  line: '#D9E2EC',
  accent: '#C44536',
  accentMuted: '#F9D8D2',
  success: '#2D6A4F',
  successMuted: '#D7F5E3',
  warning: '#B54708',
  warningMuted: '#FDE7D2',
  info: '#1D4ED8',
  infoMuted: '#DBEAFE',
  shadow: 'rgba(15, 23, 42, 0.08)',
} as const;

export const statusColors: Record<
  IssueStatus,
  { backgroundColor: string; textColor: string }
> = {
  REPORTED: {
    backgroundColor: '#E8EEF8',
    textColor: '#334E68',
  },
  IN_PROGRESS: {
    backgroundColor: '#FDE9D9',
    textColor: '#9A3412',
  },
  SOLVED: {
    backgroundColor: '#DCFCE7',
    textColor: '#166534',
  },
};
