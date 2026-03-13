import { Transform, Type } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Max, Min } from 'class-validator';
import { IssueCategory, IssueStatus } from '@prisma/client';

export class QueryIssueDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  search?: string;

  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @IsOptional()
  @IsEnum(IssueCategory)
  category?: IssueCategory;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
