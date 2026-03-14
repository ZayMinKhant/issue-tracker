import { createZodDto } from 'nestjs-zod';
import { queryIssueDtoSchema } from '@issue-tracker/utils';

export class QueryIssueDto extends createZodDto(queryIssueDtoSchema) {}
