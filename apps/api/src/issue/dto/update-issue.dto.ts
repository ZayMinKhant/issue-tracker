import { Transform } from 'class-transformer';
import { IssueCategory, IssueStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

function trimString(value: unknown) {
  return typeof value === 'string' ? value.trim() : value;
}

function trimNullableString(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export class UpdateIssueDto {
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @Transform(({ value }) => trimNullableString(value))
  @IsOptional()
  @IsString()
  submitterName?: string | null;

  @IsOptional()
  @IsEnum(IssueCategory)
  category?: IssueCategory;

  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  attachmentName?: string;
}
