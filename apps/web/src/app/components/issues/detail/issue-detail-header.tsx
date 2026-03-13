'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumb } from '@/app/common/breadcrumb';

interface IssueDetailHeaderProps {
  onDelete: () => void;
}

export function IssueDetailHeader({ onDelete }: IssueDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <Link
          href="/issues"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back</span>
        </Link>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)]">
          Issue Detail
        </h1>
        <Breadcrumb
          items={[
            { href: '/', label: 'Home' },
            { href: '/issues', label: 'Issues' },
            { label: 'Issue Detail' },
          ]}
        />
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-11 items-center justify-center rounded-full bg-red-500 px-6 text-sm font-medium text-white transition hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
}
