import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { QueryIssueDto } from './dto/query-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssueService } from './issue.service';

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Get()
  findAll(@Query() query: QueryIssueDto) {
    return this.issueService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.issueService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateIssueDto) {
    return this.issueService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIssueDto) {
    return this.issueService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.issueService.remove(id);
  }
}