import { createZodDto } from 'nestjs-zod';
import { createIssueSchema } from '@issue-tracker/utils';

export class CreateIssueDto extends createZodDto(createIssueSchema) {}
