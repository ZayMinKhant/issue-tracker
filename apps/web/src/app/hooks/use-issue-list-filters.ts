'use client';

import { useDeferredValue, useEffect, useState, startTransition } from 'react';
import type { IssueCategory, IssueStatus } from '@issue-tracker/types';
import {
  getValidIssuePage,
  normalizeFromDate,
  normalizeToDate,
  syncIssueDateRange,
} from '@issue-tracker/utils';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getIssues } from '@/lib/issues';
import { issueKeys } from '@/lib/query-keys';

export function useIssueListFilters() {
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'ALL'>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(searchInput.trim());

  const query = {
    search: deferredSearch || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    category: categoryFilter === 'ALL' ? undefined : categoryFilter,
    from: normalizeFromDate(fromDate),
    to: normalizeToDate(toDate),
    page,
    limit: 5 as const,
  };

  const issuesQuery = useQuery({
    queryKey: issueKeys.list(query),
    queryFn: () => getIssues(query),
    placeholderData: keepPreviousData,
  });

  const issues = issuesQuery.data?.items ?? [];
  const meta = issuesQuery.data?.meta;
  const totalPages = Math.max(meta?.totalPages ?? 1, 1);

  useEffect(() => {
    const nextPage = getValidIssuePage(page, meta?.totalPages);

    if (nextPage !== page) {
      startTransition(() => {
        setPage(nextPage);
      });
    }
  }, [meta?.totalPages, page]);

  const handleFromDateChange = (value: string) => {
    const nextRange = syncIssueDateRange({ fromDate, toDate }, 'from', value);
    setFromDate(nextRange.fromDate);
    setToDate(nextRange.toDate);
  };

  const handleToDateChange = (value: string) => {
    const nextRange = syncIssueDateRange({ fromDate, toDate }, 'to', value);
    setFromDate(nextRange.fromDate);
    setToDate(nextRange.toDate);
  };

  const hasFilters =
    Boolean(deferredSearch) ||
    statusFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    Boolean(fromDate) ||
    Boolean(toDate);

  const clearFilters = () => {
    setSearchInput('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  return {
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    fromDate,
    toDate,
    page,
    setPage,
    deferredSearch,
    issuesQuery,
    issues,
    meta,
    totalPages,
    handleFromDateChange,
    handleToDateChange,
    hasFilters,
    clearFilters,
  };
}
