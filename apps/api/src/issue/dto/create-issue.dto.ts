import { Transform } from 'class-transformer';
import { IssueCategory } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

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

export class CreateIssueDto {
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title!: string;

  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description!: string;

  @Transform(({ value }) => trimNullableString(value))
  @IsOptional()
  @IsString()
  submitterName?: string | null;

  @IsEnum(IssueCategory)
  category!: IssueCategory;

  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  attachmentName?: string;
}
