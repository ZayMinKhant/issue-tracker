import type { IssueCategory, IssueQuery, IssueStatus } from '@issue-tracker/types';
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
import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ChoiceChip } from '../../components/ui/choice-chip';
import { getIssues } from '../../features/issues/api';
import { IssueListItem } from '../../features/issues/issue-list-item';
import { issueKeys } from '../../features/issues/query-keys';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'IssuesList'>;
type FilterValue<T> = T | 'ALL';

export function IssuesListScreen({ navigation }: Props) {
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterValue<IssueStatus>>('ALL');
  const [categoryFilter, setCategoryFilter] =
    useState<FilterValue<IssueCategory>>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
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

  return (
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
              Adjust the filters or create a new issue from the button above.
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
          <View style={styles.heroCard}>
            <View style={styles.heroCopy}>
              <Text style={styles.heroEyebrow}>Live issue operations</Text>
              <Text style={styles.heroTitle}>
                Track, triage, and resolve from your phone.
              </Text>
              <Text style={styles.heroDescription}>
                This mobile flow uses the same issue contract as the web app and
                refreshes live when the backend emits socket events.
              </Text>
            </View>

            <Pressable
              onPress={() => navigation.navigate('CreateIssue')}
              style={({ pressed }) => [
                styles.createButton,
                pressed ? styles.createButtonPressed : null,
              ]}
            >
              <Text style={styles.createButtonLabel}>Create Issue</Text>
            </Pressable>
          </View>

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

            <Text style={styles.filterLabel}>Status</Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.chipRow}
              showsHorizontalScrollIndicator={false}
            >
              {(['ALL', 'REPORTED', 'IN_PROGRESS', 'SOLVED'] as const).map((status) => (
                <ChoiceChip
                  key={status}
                  label={status === 'ALL' ? 'All statuses' : statusLabels[status]}
                  onPress={() => {
                    setStatusFilter(status);
                    resetPage();
                  }}
                  selected={statusFilter === status}
                />
              ))}
            </ScrollView>

            <Text style={styles.filterLabel}>Category</Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.chipRow}
              showsHorizontalScrollIndicator={false}
            >
              {(
                [
                  'ALL',
                  'GENERAL',
                  'MAINTENANCE',
                  'SECURITY',
                  'CLEANING',
                  'NOISE',
                  'PARKING',
                ] as const
              ).map((category) => (
                <ChoiceChip
                  key={category}
                  label={category === 'ALL' ? 'All categories' : formatEnumLabel(category)}
                  onPress={() => {
                    setCategoryFilter(category);
                    resetPage();
                  }}
                  selected={categoryFilter === category}
                />
              ))}
            </ScrollView>

            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <Text style={styles.filterLabel}>From</Text>
                <TextInput
                  keyboardType="numbers-and-punctuation"
                  onChangeText={handleFromDateChange}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.muted}
                  style={styles.dateInput}
                  value={fromDate}
                />
              </View>

              <View style={styles.dateField}>
                <Text style={styles.filterLabel}>To</Text>
                <TextInput
                  keyboardType="numbers-and-punctuation"
                  onChangeText={handleToDateChange}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.muted}
                  style={styles.dateInput}
                  value={toDate}
                />
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
  );
}

const styles = StyleSheet.create({
  chipRow: {
    paddingTop: 8,
  },
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
  createButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  createButtonLabel: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '800',
  },
  createButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  dateField: {
    flex: 1,
  },
  dateInput: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    color: colors.text,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dateRow: {
    columnGap: 12,
    flexDirection: 'row',
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
    fontWeight: '700',
    marginTop: 18,
    textTransform: 'uppercase',
  },
  filtersCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 18,
    padding: 20,
  },
  heroCard: {
    backgroundColor: colors.text,
    borderRadius: 32,
    marginBottom: 18,
    overflow: 'hidden',
    padding: 22,
  },
  heroCopy: {
    marginBottom: 18,
  },
  heroDescription: {
    color: '#D9E2EC',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  heroEyebrow: {
    color: colors.accentMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
    marginTop: 10,
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
    borderRadius: 18,
    borderWidth: 1,
    color: colors.text,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
});
