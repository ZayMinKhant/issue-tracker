import { createZodDto } from 'nestjs-zod';
import { queryIssueSchema } from '@issue-tracker/utils';

export class QueryIssueDto extends createZodDto(queryIssueSchema) {}
