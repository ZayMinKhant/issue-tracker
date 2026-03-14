import { describe, expect, it } from 'vitest';
import { CreateIssueDto } from './create-issue.dto';
import { QueryIssueDto } from './query-issue.dto';
import { UpdateIssueDto } from './update-issue.dto';

function expectSuccess<T>(result: {
  success: boolean;
  data?: T;
  error?: unknown;
}) {
  expect(result.success).toBe(true);

  if (!result.success) {
    throw result.error;
  }

  return result.data as T;
}

function getIssuePaths(result: {
  success: boolean;
  error?: { issues: Array<{ path: PropertyKey[] }> };
}) {
  if (result.success || !result.error) {
    return [];
  }

  return result.error.issues.map((issue) => issue.path.join('.'));
}

describe('CreateIssueDto', () => {
  it('allows an omitted submitter name', () => {
    const dto = expectSuccess(
      CreateIssueDto.schema.safeParse({
        title: 'Lobby light out',
        description: 'The main lobby light is not working.',
        category: 'MAINTENANCE',
      }),
    );

    expect(dto.submitterName).toBeUndefined();
  });

  it('normalizes a blank submitter name to undefined', () => {
    const dto = expectSuccess(
      CreateIssueDto.schema.safeParse({
        title: 'Lobby light out',
        description: 'The main lobby light is not working.',
        submitterName: '   ',
        category: 'MAINTENANCE',
      }),
    );

    expect(dto.submitterName).toBeUndefined();
  });

  it('rejects a short title and description', () => {
    const result = CreateIssueDto.schema.safeParse({
      title: 'Hi',
      description: 'Too short',
      submitterName: '',
      category: 'MAINTENANCE',
    });

    expect(result.success).toBe(false);
    expect(getIssuePaths(result)).toEqual(
      expect.arrayContaining(['title', 'description']),
    );
  });
});

describe('UpdateIssueDto', () => {
  it('normalizes a blank submitter name to null', () => {
    const dto = expectSuccess(
      UpdateIssueDto.schema.safeParse({
        submitterName: '   ',
      }),
    );

    expect(dto.submitterName).toBeNull();
  });

  it('rejects a short title when provided', () => {
    const result = UpdateIssueDto.schema.safeParse({
      title: 'Hi',
    });

    expect(result.success).toBe(false);
    expect(getIssuePaths(result)).toContain('title');
  });
});

describe('QueryIssueDto', () => {
  it('rejects invalid date strings and oversized page limits', () => {
    const result = QueryIssueDto.schema.safeParse({
      from: 'not-a-date',
      to: 'also-not-a-date',
      limit: 101,
    });

    expect(result.success).toBe(false);
    expect(getIssuePaths(result)).toEqual(
      expect.arrayContaining(['from', 'to', 'limit']),
    );
  });
});
