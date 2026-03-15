import {
  createIssueSchema,
  getValidIssuePage,
  normalizeFromDate,
  normalizeToDate,
  syncIssueDateRange,
} from '@issue-tracker/utils';

describe('shared issue utils', () => {
  it('uses the shared create issue schema', () => {
    expect(
      createIssueSchema.parse({
        attachmentName: '',
        category: 'MAINTENANCE',
        description: 'The lobby light is out and needs repair.',
        submitterName: ' Front desk ',
        title: 'Lobby light out',
      }),
    ).toEqual({
      attachmentName: '',
      category: 'MAINTENANCE',
      description: 'The lobby light is out and needs repair.',
      submitterName: 'Front desk',
      title: 'Lobby light out',
    });
  });

  it('clamps invalid pages and keeps valid date ranges in sync', () => {
    expect(getValidIssuePage(4, 2)).toBe(2);
    expect(
      syncIssueDateRange(
        { fromDate: '2026-03-10', toDate: '2026-03-12' },
        'to',
        '2026-03-08',
      ),
    ).toEqual({
      fromDate: '2026-03-08',
      toDate: '2026-03-08',
    });
  });

  it('normalizes selected dates using local day boundaries', () => {
    expect(normalizeFromDate('2026-03-10')).toBe(
      new Date(2026, 2, 10, 0, 0, 0, 0).toISOString(),
    );
    expect(normalizeToDate('2026-03-10')).toBe(
      new Date(2026, 2, 10, 23, 59, 59, 999).toISOString(),
    );
  });
});
