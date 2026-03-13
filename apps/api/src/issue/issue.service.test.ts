import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { IssueService } from './issue.service';

function createService() {
  const prisma = {
    issue: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  const gateway = {
    emitCreated: vi.fn(),
    emitUpdated: vi.fn(),
    emitDeleted: vi.fn(),
  };

  return {
    prisma,
    gateway,
    service: new IssueService(prisma as never, gateway as never),
  };
}

describe('IssueService.findAll', () => {
  it('clamps pagination values and keeps totalPages at least 1', async () => {
    const { prisma, service } = createService();
    prisma.issue.findMany.mockResolvedValue([]);
    prisma.issue.count.mockResolvedValue(0);

    const result = await service.findAll({
      page: 0,
      limit: 1000,
    });

    expect(prisma.issue.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 100,
      }),
    );
    expect(result.meta).toEqual({
      total: 0,
      page: 1,
      limit: 100,
      totalPages: 1,
    });
  });

  it('rejects a date range where from is later than to', async () => {
    const { service } = createService();

    await expect(
      service.findAll({
        from: '2026-03-14T00:00:00.000Z',
        to: '2026-03-13T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
