'use client';

import { IconBan, IconDots, IconEdit, IconExternalLink, IconPlus } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ColumnDef, DataTable } from '@/components/DataTable/DataTable';
import { AdminLayout } from '@/components/Layouts/AdminLayout';

interface PartnerOrg {
  id: string;
  name: string;
  hqRegion: string;
  activePrograms: number;
  status: 'Active' | 'Suspended' | 'Onboarding';
}

const mockPOs: PartnerOrg[] = [
  { id: 'PO-001', name: 'BRAC', hqRegion: 'Dhaka', activePrograms: 12, status: 'Active' },
  { id: 'PO-002', name: 'Grameen Koota', hqRegion: 'Sylhet', activePrograms: 8, status: 'Active' },
  { id: 'PO-003', name: 'TMSS', hqRegion: 'Bogra', activePrograms: 0, status: 'Suspended' },
  { id: 'PO-004', name: 'ASHA', hqRegion: 'Dhaka', activePrograms: 5, status: 'Active' },
  {
    id: 'PO-005',
    name: 'Buro Bangladesh',
    hqRegion: 'Chittagong',
    activePrograms: 3,
    status: 'Active',
  },
  {
    id: 'PO-006',
    name: 'Sajida Foundation',
    hqRegion: 'Rajshahi',
    activePrograms: 1,
    status: 'Onboarding',
  },
  {
    id: 'PO-007',
    name: 'RDRS Bangladesh',
    hqRegion: 'Rangpur',
    activePrograms: 7,
    status: 'Active',
  },
  { id: 'PO-008', name: 'Proshika', hqRegion: 'Barisal', activePrograms: 0, status: 'Suspended' },
];

export default function PartnerOrganizationsPage() {
  const [opened, { open, close }] = useDisclosure(false);

  const columns: ColumnDef<PartnerOrg>[] = [
    { accessor: 'id', header: 'Reg ID', sortable: true },
    { accessor: 'name', header: 'Organization Name', sortable: true },
    { accessor: 'hqRegion', header: 'Headquarters', sortable: true },
    {
      accessor: 'activePrograms',
      header: 'Active Programs',
      sortable: true,
      render: (item) => <Text fw={500}>{item.activePrograms}</Text>,
    },
    {
      accessor: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => {
        const color =
          item.status === 'Active' ? 'blue' : item.status === 'Suspended' ? 'red' : 'orange';
        return (
          <Badge color={color} variant="light">
            {item.status}
          </Badge>
        );
      },
    },
    {
      accessor: 'actions' as any,
      header: 'Actions',
      render: (item) => (
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size="1.2rem" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconExternalLink size="1rem" />}>View Dashboard</Menu.Item>
            <Menu.Item leftSection={<IconEdit size="1rem" />}>Edit Details</Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" leftSection={<IconBan size="1rem" />}>
              {item.status === 'Suspended' ? 'Lift Suspension' : 'Suspend Access'}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Partner Organizations</Title>
          <Text c="dimmed">Manage field executors and their operational access.</Text>
        </div>
        <Button leftSection={<IconPlus size="1rem" />} onClick={open}>
          Add Organization
        </Button>
      </Group>

      <Modal opened={opened} onClose={close} title="Register New Partner Organization" centered>
        <Stack>
          <TextInput label="Organization Name" placeholder="e.g., BRAC" required />
          <TextInput label="Registration ID" placeholder="e.g., NGO-AB123" required />
          <Select
            label="Primary Region (HQ)"
            placeholder="Select division"
            data={[
              'Dhaka',
              'Chittagong',
              'Rajshahi',
              'Khulna',
              'Barisal',
              'Sylhet',
              'Rangpur',
              'Mymensingh',
            ]}
            required
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button onClick={close}>Save Organization</Button>
          </Group>
        </Stack>
      </Modal>

      <DataTable
        data={mockPOs}
        columns={columns}
        searchPlaceholder="Search organizations by name or region..."
        itemsPerPage={5}
      />
    </AdminLayout>
  );
}
