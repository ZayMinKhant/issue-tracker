import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { QueryIssueDto } from './dto/query-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssueGateway } from './issue.gateway';

const ISSUE_PAGE_SIZE_MAX = 100;

@Injectable()
export class IssueService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly issueGateway: IssueGateway,
  ) {}

  async findAll(query: QueryIssueDto) {
    const { search, status, category, from, to, page = 1, limit = 10 } = query;
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), ISSUE_PAGE_SIZE_MAX);
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    if (fromDate && toDate && fromDate > toDate) {
      throw new BadRequestException('`from` must be earlier than or equal to `to`.');
    }

    const where: Prisma.IssueWhereInput = {
      ...(search
        ? {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(status ? { status } : {}),
      ...(category ? { category } : {}),
      ...((fromDate || toDate)
        ? {
            createdAt: {
              ...(fromDate ? { gte: fromDate } : {}),
              ...(toDate ? { lte: toDate } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.issue.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      this.prisma.issue.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.max(Math.ceil(total / safeLimit), 1),
      },
    };
  }

  async findOne(id: string) {
    const issue = await this.prisma.issue.findUnique({ where: { id } });
    if (!issue) throw new NotFoundException('Issue not found');
    return issue;
  }

  async create(dto: CreateIssueDto) {
    const issue = await this.prisma.issue.create({
      data: dto,
    });

    this.issueGateway.emitCreated(issue);
    return issue;
  }

  async update(id: string, dto: UpdateIssueDto) {
    await this.findOne(id);

    const issue = await this.prisma.issue.update({
      where: { id },
      data: dto,
    });

    this.issueGateway.emitUpdated(issue);
    return issue;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.issue.delete({
      where: { id },
    });

    this.issueGateway.emitDeleted({ id });

    return { id, deleted: true };
  }
}
