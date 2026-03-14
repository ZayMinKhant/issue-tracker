import { createZodDto } from 'nestjs-zod';
import { updateIssueDtoSchema } from '@issue-tracker/utils';

export class UpdateIssueDto extends createZodDto(updateIssueDtoSchema) {}
