import {
  ISSUE_CATEGORIES,
  ISSUE_STATUSES,
  type IssueCategory,
  type IssueQuery,
  type IssueStatus,
} from '@issue-tracker/types';
import {
  formatEnumLabel,
  getErrorMessage,
  getValidIssuePage,
  normalizeFromDate,
  normalizeToDate,
  statusLabels,
  syncIssueDateRange,
} from '@issue-tracker/utils';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Lucide } from '@react-native-vector-icons/lucide';
import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { SelectField } from '../../components/ui/select-field';
import { getIssues } from '../../features/issues/api';
import { IssueListItem } from '../../features/issues/issue-list-item';
import { issueKeys } from '../../features/issues/query-keys';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'IssuesList'>;
type FilterValue<T> = T | 'ALL';

const statusOptions = [
  { label: 'All statuses', value: 'ALL' },
  ...ISSUE_STATUSES.map((status) => ({
    label: statusLabels[status],
    value: status,
  })),
] as const;

const categoryOptions = [
  { label: 'All categories', value: 'ALL' },
  ...ISSUE_CATEGORIES.map((category) => ({
    label: formatEnumLabel(category),
    value: category,
  })),
] as const;

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function toPickerDate(value: string) {
  if (!value) {
    return new Date();
  }

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day, 12);
}

export function IssuesListScreen({ navigation }: Props) {
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterValue<IssueStatus>>('ALL');
  const [categoryFilter, setCategoryFilter] =
    useState<FilterValue<IssueCategory>>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [activeDatePicker, setActiveDatePicker] = useState<'from' | 'to' | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(searchInput.trim());

  const query: IssueQuery = {
    category: categoryFilter === 'ALL' ? undefined : categoryFilter,
    from: normalizeFromDate(fromDate),
    limit: 5,
    page,
    search: deferredSearch || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    to: normalizeToDate(toDate),
  };

  const issuesQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => getIssues(query),
    queryKey: issueKeys.list(query),
  });

  const issues = issuesQuery.data?.items ?? [];
  const meta = issuesQuery.data?.meta;
  const hasFilters =
    Boolean(deferredSearch) ||
    statusFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    Boolean(fromDate) ||
    Boolean(toDate);

  useEffect(() => {
    const nextPage = getValidIssuePage(page, meta?.totalPages);

    if (nextPage !== page) {
      startTransition(() => {
        setPage(nextPage);
      });
    }
  }, [meta?.totalPages, page]);

  function resetPage() {
    startTransition(() => {
      setPage(1);
    });
  }

  function handleFromDateChange(value: string) {
    const nextRange = syncIssueDateRange({ fromDate, toDate }, 'from', value.trim());
    setFromDate(nextRange.fromDate);
    setToDate(nextRange.toDate);
    resetPage();
  }

  function handleToDateChange(value: string) {
    const nextRange = syncIssueDateRange({ fromDate, toDate }, 'to', value.trim());
    setFromDate(nextRange.fromDate);
    setToDate(nextRange.toDate);
    resetPage();
  }

  function clearFilters() {
    setSearchInput('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setFromDate('');
    setToDate('');
    resetPage();
  }

  function clearDate(field: 'from' | 'to') {
    if (field === 'from') {
      setFromDate('');
    } else {
      setToDate('');
    }

    resetPage();
  }

  function confirmDatePicker(date: Date) {
    const formattedDate = formatDateValue(date);

    if (activeDatePicker === 'from') {
      handleFromDateChange(formattedDate);
    } else if (activeDatePicker === 'to') {
      handleToDateChange(formattedDate);
    }

    setActiveDatePicker(null);
  }

  return (
    <>
      <FlatList
        contentContainerStyle={[
          styles.content,
          issues.length === 0 ? styles.contentEmpty : null,
        ]}
        data={issues}
        keyExtractor={(issue) => issue.id}
        ListEmptyComponent={
          issuesQuery.isLoading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color={colors.accent} />
              <Text style={styles.emptyTitle}>Loading issues</Text>
              <Text style={styles.emptyDescription}>
                Pulling the latest data from the API.
              </Text>
            </View>
          ) : issuesQuery.isError ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Could not load issues</Text>
              <Text style={styles.emptyDescription}>
                {getErrorMessage(issuesQuery.error)}
              </Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No issues match these filters</Text>
              <Text style={styles.emptyDescription}>
                Adjust the filters or create a new issue from the header button.
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          <View style={styles.paginationRow}>
            <Pressable
              disabled={(meta?.page ?? 1) <= 1}
              onPress={() =>
                startTransition(() => {
                  setPage((currentPage) => Math.max(currentPage - 1, 1));
                })
              }
              style={({ pressed }) => [
                styles.paginationButton,
                (meta?.page ?? 1) <= 1 ? styles.paginationDisabled : null,
                pressed ? styles.paginationPressed : null,
              ]}
            >
              <Text style={styles.paginationLabel}>Previous</Text>
            </Pressable>

            <Text style={styles.paginationMeta}>
              Page {meta?.page ?? 1} of {Math.max(meta?.totalPages ?? 1, 1)}
            </Text>

            <Pressable
              disabled={(meta?.page ?? 1) >= Math.max(meta?.totalPages ?? 1, 1)}
              onPress={() =>
                startTransition(() => {
                  setPage((currentPage) =>
                    Math.min(currentPage + 1, Math.max(meta?.totalPages ?? 1, 1)),
                  );
                })
              }
              style={({ pressed }) => [
                styles.paginationButton,
                (meta?.page ?? 1) >= Math.max(meta?.totalPages ?? 1, 1)
                  ? styles.paginationDisabled
                  : null,
                pressed ? styles.paginationPressed : null,
              ]}
            >
              <Text style={styles.paginationLabel}>Next</Text>
            </Pressable>
          </View>
        }
        ListHeaderComponent={
          <View>
            <View style={styles.filtersCard}>
              <Text style={styles.sectionTitle}>Search and filters</Text>

              <TextInput
                onChangeText={(value) => {
                  setSearchInput(value);
                  resetPage();
                }}
                placeholder="Search by issue title"
                placeholderTextColor={colors.muted}
                style={styles.searchInput}
                value={searchInput}
              />

              <View style={styles.filterRow}>
                <View style={styles.filterColumn}>
                  <Text style={styles.filterLabel}>Status</Text>
                  <SelectField
                    onChange={(value) => {
                      setStatusFilter(value as FilterValue<IssueStatus>);
                      resetPage();
                    }}
                    options={statusOptions}
                    selectedValue={statusFilter}
                    title="Status"
                  />
                </View>

                <View style={styles.filterColumn}>
                  <Text style={styles.filterLabel}>Category</Text>
                  <SelectField
                    onChange={(value) => {
                      setCategoryFilter(value as FilterValue<IssueCategory>);
                      resetPage();
                    }}
                    options={categoryOptions}
                    selectedValue={categoryFilter}
                    title="Category"
                  />
                </View>
              </View>

              <View style={styles.dateRow}>
                <View style={styles.dateField}>
                  <View style={styles.dateFieldHeader}>
                    <Text style={styles.filterLabel}>From</Text>
                    {fromDate ? (
                      <Pressable
                        onPress={() => clearDate('from')}
                        style={styles.dateClearButton}
                      >
                        <Lucide color={colors.accent} name="x" size={14} />
                        <Text style={styles.dateClearLabel}>Clear</Text>
                      </Pressable>
                    ) : null}
                  </View>
                  <Pressable
                    onPress={() => setActiveDatePicker('from')}
                    style={({ pressed }) => [
                      styles.dateButton,
                      pressed ? styles.paginationPressed : null,
                    ]}
                  >
                    <Lucide
                      color={fromDate ? colors.accent : colors.muted}
                      name="calendar-days"
                      size={16}
                    />
                    <Text
                      style={[
                        styles.dateButtonLabel,
                        !fromDate ? styles.datePlaceholder : null,
                      ]}
                    >
                      {fromDate || 'Select date'}
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.dateField}>
                  <View style={styles.dateFieldHeader}>
                    <Text style={styles.filterLabel}>To</Text>
                    {toDate ? (
                      <Pressable
                        onPress={() => clearDate('to')}
                        style={styles.dateClearButton}
                      >
                        <Lucide color={colors.accent} name="x" size={14} />
                        <Text style={styles.dateClearLabel}>Clear</Text>
                      </Pressable>
                    ) : null}
                  </View>
                  <Pressable
                    onPress={() => setActiveDatePicker('to')}
                    style={({ pressed }) => [
                      styles.dateButton,
                      pressed ? styles.paginationPressed : null,
                    ]}
                  >
                    <Lucide
                      color={toDate ? colors.accent : colors.muted}
                      name="calendar-days"
                      size={16}
                    />
                    <Text
                      style={[
                        styles.dateButtonLabel,
                        !toDate ? styles.datePlaceholder : null,
                      ]}
                    >
                      {toDate || 'Select date'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                disabled={!hasFilters}
                onPress={clearFilters}
                style={({ pressed }) => [
                  styles.clearButton,
                  !hasFilters ? styles.paginationDisabled : null,
                  pressed && hasFilters ? styles.paginationPressed : null,
                ]}
              >
                <Text style={styles.clearButtonLabel}>Clear Filters</Text>
              </Pressable>
            </View>
          </View>
        }
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              void issuesQuery.refetch();
            }}
            refreshing={issuesQuery.isRefetching && !issuesQuery.isLoading}
            tintColor={colors.accent}
          />
        }
        renderItem={({ item }) => (
          <IssueListItem
            issue={item}
            onPress={(issue) =>
              navigation.navigate('IssueDetail', { issueId: issue.id })
            }
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <DatePicker
        buttonColor={colors.accent}
        cancelText="Cancel"
        confirmText="Apply"
        date={toPickerDate(fromDate)}
        maximumDate={toDate ? toPickerDate(toDate) : undefined}
        modal
        mode="date"
        onCancel={() => setActiveDatePicker(null)}
        onConfirm={confirmDatePicker}
        open={activeDatePicker === 'from'}
        theme="light"
        title="Select from date"
      />

      <DatePicker
        buttonColor={colors.accent}
        cancelText="Cancel"
        confirmText="Apply"
        date={toPickerDate(toDate)}
        minimumDate={fromDate ? toPickerDate(fromDate) : undefined}
        modal
        mode="date"
        onCancel={() => setActiveDatePicker(null)}
        onConfirm={confirmDatePicker}
        open={activeDatePicker === 'to'}
        theme="light"
        title="Select to date"
      />
    </>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  clearButtonLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  contentEmpty: {
    flexGrow: 1,
  },
  dateButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.line,
    borderRadius: 10,
    borderWidth: 1,
    columnGap: 10,
    flexDirection: 'row',
    marginTop: 8,
    minHeight: 46,
    justifyContent: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateButtonLabel: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
  },
  dateClearButton: {
    alignItems: 'center',
    columnGap: 4,
    flexDirection: 'row',
  },
  dateClearLabel: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  dateField: {
    flex: 1,
  },
  dateFieldHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateRow: {
    columnGap: 12,
    flexDirection: 'row',
  },
  datePlaceholder: {
    color: colors.muted,
  },
  emptyDescription: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 240,
    padding: 24,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 14,
    textAlign: 'center',
  },
  filterLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 18,
  },
  filterColumn: {
    flex: 1,
  },
  filtersCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 18,
    padding: 20,
    paddingTop: 8,
  },
  filterRow: {
    columnGap: 12,
    flexDirection: 'row',
  },
  paginationButton: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  paginationDisabled: {
    opacity: 0.45,
  },
  paginationLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  paginationMeta: {
    color: colors.muted,
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 14,
    textAlign: 'center',
  },
  paginationPressed: {
    transform: [{ scale: 0.98 }],
  },
  paginationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 8,
  },
  searchInput: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.line,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.text,
    marginTop: 8,
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
});
