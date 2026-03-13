import { Module } from '@nestjs/common';
import { IssueController } from './issue.controller';
import { IssueGateway } from './issue.gateway';
import { IssueService } from './issue.service';

@Module({
  controllers: [IssueController],
  providers: [IssueService, IssueGateway],
})
export class IssueModule {}