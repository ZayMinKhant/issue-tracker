import { createZodDto } from 'nestjs-zod';
import { createIssueDtoSchema } from '@issue-tracker/utils';

export class CreateIssueDto extends createZodDto(createIssueDtoSchema) {}
