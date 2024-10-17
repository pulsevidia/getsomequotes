import { Avatar, Badge, Table, Group, Text, ActionIcon,   } from '@mantine/core';
import { Pencil as IconPencil, Trash as IconTrash } from '@phosphor-icons/react';
import CopyButton from './CopyButton';

export default function BookList({data}) {
  const rows = data.map((item) => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <Group gap="sm">
          <Text fz="sm" fw={500}>
          The Fabric Of Reality
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge color={'blue'} px={'0'} py={'sm'} styles={{label:{textTransform:'none', display:'flex', alignItems:'center'}}}  maw={100} variant="light">

            <CopyButton value={item.pdf_link} />
            <Text fz="xs" truncate={'end'}>
            {item.pdf_link}
            </Text>
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.blogs.length}</Text>
      </Table.Td>
       <Table.Td>
        <Text fz="sm">{item.quotes.length}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <IconTrash size={16}  />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer mx={'md'} minWidth={800}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Book</Table.Th>
            <Table.Th>PDF</Table.Th>
            <Table.Th>Blogs</Table.Th>
            <Table.Th>Quotes</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}