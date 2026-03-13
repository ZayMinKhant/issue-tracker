import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { CreateIssueDto } from './create-issue.dto';
import { QueryIssueDto } from './query-issue.dto';
import { UpdateIssueDto } from './update-issue.dto';

function getMessages(errors: ReturnType<typeof validateSync>) {
  return errors.flatMap((error) => Object.values(error.constraints ?? {}));
}

describe('CreateIssueDto', () => {
  it('allows an omitted submitter name', () => {
    const dto = plainToInstance(CreateIssueDto, {
      title: 'Lobby light out',
      description: 'The main lobby light is not working.',
      category: 'MAINTENANCE',
    });

    expect(validateSync(dto)).toHaveLength(0);
    expect(dto.submitterName).toBeUndefined();
  });

  it('normalizes a blank submitter name to null', () => {
    const dto = plainToInstance(CreateIssueDto, {
      title: 'Lobby light out',
      description: 'The main lobby light is not working.',
      submitterName: '   ',
      category: 'MAINTENANCE',
    });

    expect(validateSync(dto)).toHaveLength(0);
    expect(dto.submitterName).toBeNull();
  });

  it('rejects a short title and description', () => {
    const dto = plainToInstance(CreateIssueDto, {
      title: 'Hi',
      description: 'Too short',
      submitterName: '',
      category: 'MAINTENANCE',
    });

    const messages = getMessages(validateSync(dto));
    expect(messages).toContain('title must be longer than or equal to 3 characters');
    expect(messages).toContain('description must be longer than or equal to 10 characters');
  });
});

describe('UpdateIssueDto', () => {
  it('normalizes a blank submitter name to null', () => {
    const dto = plainToInstance(UpdateIssueDto, {
      submitterName: '   ',
    });

    expect(validateSync(dto)).toHaveLength(0);
    expect(dto.submitterName).toBeNull();
  });

  it('rejects a short title when provided', () => {
    const dto = plainToInstance(UpdateIssueDto, {
      title: 'Hi',
    });

    const messages = getMessages(validateSync(dto));
    expect(messages).toContain('title must be longer than or equal to 3 characters');
  });
});

describe('QueryIssueDto', () => {
  it('rejects invalid date strings and oversized page limits', () => {
    const dto = plainToInstance(QueryIssueDto, {
      from: 'not-a-date',
      to: 'also-not-a-date',
      limit: 101,
    });

    const messages = getMessages(validateSync(dto));
    expect(messages).toContain('from must be a valid ISO 8601 date string');
    expect(messages).toContain('to must be a valid ISO 8601 date string');
    expect(messages).toContain('limit must not be greater than 100');
  });
});
