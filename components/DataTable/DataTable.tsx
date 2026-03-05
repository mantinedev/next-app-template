'use client';

import { useMemo, useState } from 'react';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react';
import { Group, Pagination, Paper, rem, ScrollArea, Table, Text, TextInput } from '@mantine/core';

export interface ColumnDef<T> {
  accessor: Extract<keyof T, string>;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  itemsPerPage?: number;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Search records...',
  itemsPerPage = 10,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<Extract<keyof T, string> | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: Extract<keyof T, string>) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const processedData = useMemo(() => {
    let result = [...data];
    if (search) {
      const query = search.toLowerCase().trim();
      result = result.filter((item) =>
        Object.keys(item).some((key) => String(item[key]).toLowerCase().includes(query))
      );
    }
    if (sortBy) {
      result.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return reverseSortDirection ? valB - valA : valA - valB;
        }
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return reverseSortDirection ? strB.localeCompare(strA) : strA.localeCompare(strB);
      });
    }
    return result;
  }, [data, search, sortBy, reverseSortDirection]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Paper shadow="sm" radius="md" withBorder p="0">
      {searchable && (
        <Group
          justify="space-between"
          p="md"
          style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
        >
          <TextInput
            placeholder={searchPlaceholder}
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              setPage(1);
            }}
            style={{ width: '300px' }}
          />
          <Text size="sm" c="dimmed">
            Showing {paginatedData.length} of {processedData.length} records
          </Text>
        </Group>
      )}

      <ScrollArea>
        <Table miw={800} verticalSpacing="sm" horizontalSpacing="md" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th key={col.accessor}>
                  {!col.sortable ? (
                    <Text fw={600} size="sm">
                      {col.header}
                    </Text>
                  ) : (
                    <UnstyledSortButton
                      header={col.header}
                      sorted={sortBy === col.accessor}
                      reversed={reverseSortDirection}
                      onSort={() => setSorting(col.accessor)}
                    />
                  )}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <Table.Tr key={index}>
                  {columns.map((col) => (
                    <Table.Td key={col.accessor}>
                      {col.render ? col.render(row) : <Text size="sm">{row[col.accessor]}</Text>}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <Text fw={500} ta="center" py="xl" c="dimmed">
                    No records found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {totalPages > 1 && (
        <Group
          justify="flex-end"
          p="md"
          style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}
        >
          <Pagination total={totalPages} value={page} onChange={setPage} radius="md" />
        </Group>
      )}
    </Paper>
  );
}

function UnstyledSortButton({ header, sorted, reversed, onSort }: any) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Group
      component="button"
      onClick={onSort}
      style={{ all: 'unset', cursor: 'pointer', display: 'flex', width: '100%' }}
      justify="space-between"
      wrap="nowrap"
    >
      <Text fw={600} size="sm">
        {header}
      </Text>
      <Icon
        style={{ width: rem(14), height: rem(14) }}
        stroke={1.5}
        color={sorted ? 'var(--mantine-primary-color-filled)' : 'var(--mantine-color-dimmed)'}
      />
    </Group>
  );
}
