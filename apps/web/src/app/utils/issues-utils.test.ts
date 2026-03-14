import { describe, expect, it } from 'vitest';
import {
  createIssueSchema,
  getValidIssuePage,
  normalizeOptionalTextInput,
  syncIssueDateRange,
  toUpdateIssueFormValues,
} from '@issue-tracker/utils';

describe('createIssueSchema', () => {
  it('allows a blank submitter name', () => {
    expect(
      createIssueSchema.parse({
        title: 'Lobby light out',
        description: 'The main lobby light is not working.',
        submitterName: '   ',
        category: 'MAINTENANCE',
        attachmentName: '',
      }),
    ).toEqual({
      title: 'Lobby light out',
      description: 'The main lobby light is not working.',
      submitterName: '',
      category: 'MAINTENANCE',
      attachmentName: '',
    });
  });
});

describe('normalizeOptionalTextInput', () => {
  it('returns undefined for blank input', () => {
    expect(normalizeOptionalTextInput('   ')).toBeUndefined();
  });

  it('returns a trimmed string for non-blank input', () => {
    expect(normalizeOptionalTextInput(' Front desk ')).toBe('Front desk');
  });
});

describe('getValidIssuePage', () => {
  it('keeps a page inside the available range', () => {
    expect(getValidIssuePage(2, 4)).toBe(2);
  });

  it('clamps a page down to the last available page', () => {
    expect(getValidIssuePage(3, 2)).toBe(2);
  });

  it('never returns less than page 1', () => {
    expect(getValidIssuePage(2, 0)).toBe(1);
    expect(getValidIssuePage(0, 5)).toBe(1);
  });
});

describe('syncIssueDateRange', () => {
  it('moves the to date forward when from date becomes later', () => {
    expect(
      syncIssueDateRange(
        { fromDate: '2026-03-10', toDate: '2026-03-12' },
        'from',
        '2026-03-15',
      ),
    ).toEqual({
      fromDate: '2026-03-15',
      toDate: '2026-03-15',
    });
  });

  it('moves the from date backward when to date becomes earlier', () => {
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

  it('keeps a valid date range unchanged beyond the edited field', () => {
    expect(
      syncIssueDateRange(
        { fromDate: '2026-03-10', toDate: '2026-03-12' },
        'to',
        '2026-03-14',
      ),
    ).toEqual({
      fromDate: '2026-03-10',
      toDate: '2026-03-14',
    });
  });
});

describe('toUpdateIssueFormValues', () => {
  it('normalizes a nullable submitter name to an empty string', () => {
    expect(
      toUpdateIssueFormValues({
        id: 'issue-1',
        title: 'Lobby light out',
        description: 'The main lobby light is not working.',
        submitterName: null,
        category: 'MAINTENANCE',
        status: 'REPORTED',
        attachmentName: 'photo.jpg',
        createdAt: '2026-03-13T10:00:00.000Z',
        updatedAt: '2026-03-13T10:00:00.000Z',
      }),
    ).toEqual({
      title: 'Lobby light out',
      description: 'The main lobby light is not working.',
      submitterName: '',
      category: 'MAINTENANCE',
      status: 'REPORTED',
      attachmentName: 'photo.jpg',
    });
  });

  it('normalizes a nullable attachment name to an empty string', () => {
    expect(
      toUpdateIssueFormValues({
        id: 'issue-1',
        title: 'Lobby light out',
        description: 'The main lobby light is not working.',
        submitterName: 'Front desk',
        category: 'MAINTENANCE',
        status: 'REPORTED',
        attachmentName: null,
        createdAt: '2026-03-13T10:00:00.000Z',
        updatedAt: '2026-03-13T10:00:00.000Z',
      }),
    ).toEqual({
      title: 'Lobby light out',
      description: 'The main lobby light is not working.',
      submitterName: 'Front desk',
      category: 'MAINTENANCE',
      status: 'REPORTED',
      attachmentName: '',
    });
  });
});
