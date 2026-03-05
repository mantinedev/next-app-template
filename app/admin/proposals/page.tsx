'use client';

import { IconCheck, IconDots, IconEye, IconX } from '@tabler/icons-react';
import { ActionIcon, Badge, Menu, Text, Title } from '@mantine/core';
import { ColumnDef, DataTable } from '@/components/DataTable/DataTable';
import { AdminLayout } from '@/components/Layouts/AdminLayout';

interface Proposal {
  id: string;
  poName: string;
  region: string;
  budget: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const mockProposals: Proposal[] = [
  { id: 'PRJ-2026-001', poName: 'BRAC', region: 'Khulna', budget: 4500000, status: 'Pending' },
  {
    id: 'PRJ-2026-002',
    poName: 'Grameen Koota',
    region: 'Sylhet',
    budget: 2100000,
    status: 'Approved',
  },
  { id: 'PRJ-2026-003', poName: 'TMSS', region: 'Bogra', budget: 3200000, status: 'Rejected' },
  { id: 'PRJ-2026-004', poName: 'ASHA', region: 'Dhaka', budget: 8900000, status: 'Pending' },
  {
    id: 'PRJ-2026-005',
    poName: 'Buro Bangladesh',
    region: 'Chittagong',
    budget: 5500000,
    status: 'Approved',
  },
  {
    id: 'PRJ-2026-006',
    poName: 'Sajida Foundation',
    region: 'Rajshahi',
    budget: 4200000,
    status: 'Pending',
  },
  {
    id: 'PRJ-2026-007',
    poName: 'RDRS Bangladesh',
    region: 'Rangpur',
    budget: 6100000,
    status: 'Approved',
  },
  {
    id: 'PRJ-2026-008',
    poName: 'Proshika',
    region: 'Barisal',
    budget: 2800000,
    status: 'Rejected',
  },
  {
    id: 'PRJ-2026-009',
    poName: 'COAST Trust',
    region: "Cox's Bazar",
    budget: 7300000,
    status: 'Approved',
  },
  { id: 'PRJ-2026-010', poName: 'SSS', region: 'Tangail', budget: 3500000, status: 'Pending' },
  { id: 'PRJ-2026-011', poName: 'UDDIPAN', region: 'Comilla', budget: 4800000, status: 'Approved' },
  { id: 'PRJ-2026-012', poName: 'CODEC', region: 'Noakhali', budget: 5200000, status: 'Pending' },
  {
    id: 'PRJ-2026-013',
    poName: 'HEED Bangladesh',
    region: 'Mymensingh',
    budget: 1900000,
    status: 'Rejected',
  },
  {
    id: 'PRJ-2026-014',
    poName: 'Jagorani Chakra',
    region: 'Jessore',
    budget: 6700000,
    status: 'Approved',
  },
  {
    id: 'PRJ-2026-015',
    poName: 'Padakhep',
    region: 'Faridpur',
    budget: 2400000,
    status: 'Pending',
  },
  {
    id: 'PRJ-2026-016',
    poName: 'PIDIM Foundation',
    region: 'Sirajganj',
    budget: 3100000,
    status: 'Rejected',
  },
  { id: 'PRJ-2026-017', poName: 'VARD', region: 'Sylhet', budget: 4600000, status: 'Approved' },
  { id: 'PRJ-2026-018', poName: 'YPSA', region: 'Chittagong', budget: 8200000, status: 'Pending' },
  { id: 'PRJ-2026-019', poName: 'SUS', region: 'Netrokona', budget: 1500000, status: 'Rejected' },
  {
    id: 'PRJ-2026-020',
    poName: 'Wave Foundation',
    region: 'Chuadanga',
    budget: 3900000,
    status: 'Approved',
  },
];

export default function ProposalsPage() {
  const columns: ColumnDef<Proposal>[] = [
    { accessor: 'id', header: 'Proposal ID', sortable: true },
    { accessor: 'poName', header: 'Partner Organization', sortable: true },
    { accessor: 'region', header: 'Target Region', sortable: true },
    {
      accessor: 'budget',
      header: 'Budget (BDT)',
      sortable: true,
      render: (item) => <Text fw={500}>৳ {item.budget.toLocaleString()}</Text>,
    },
    {
      accessor: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => {
        const color =
          item.status === 'Approved' ? 'green' : item.status === 'Rejected' ? 'red' : 'yellow';
        return (
          <Badge color={color} variant="light">
            {item.status}
          </Badge>
        );
      },
    },
    {
      accessor: 'actions',
      header: 'Actions',
      render: (item) => (
        <Menu shadow="md" width={150} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size="1.2rem" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEye size="1rem" />}>Review</Menu.Item>
            <Menu.Item color="green" leftSection={<IconCheck size="1rem" />}>
              Approve
            </Menu.Item>
            <Menu.Item color="red" leftSection={<IconX size="1rem" />}>
              Reject
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Title order={2} mb="md">
        Project Proposals
      </Title>
      <Text c="dimmed" mb="xl">
        Evaluate and approve new submissions from Partner Organizations.
      </Text>

      <DataTable
        data={mockProposals}
        columns={columns}
        searchPlaceholder="Search proposals by ID, PO, or Region..."
        itemsPerPage={5}
      />
    </AdminLayout>
  );
}
