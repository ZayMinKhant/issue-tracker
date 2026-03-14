import { createZodDto } from 'nestjs-zod';
import { updateIssueSchema } from '@issue-tracker/utils';

export class UpdateIssueDto extends createZodDto(updateIssueSchema) {}
