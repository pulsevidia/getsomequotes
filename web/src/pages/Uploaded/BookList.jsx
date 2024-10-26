import { Badge, Table, Group, Text, Button } from "@mantine/core";
import CopyButton from "./CopyButton";

export default function BookList({
  data,
  openGenerateBookModal,
  openDeleteBookModal,
  setGenerateBookId,
  setDeleteBookId,
  isGeneratingBook,
}) {
  const rows = data.map((item) => (
    <Table.Tr key={item.$id}>
      <Table.Td>
        <Group gap="sm">
          <Text fz="sm" w={200} truncate={"end"} fw={500}>
            {item?.book_name || "Untitled"}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge
          color={"blue"}
          px={"0"}
          py={"sm"}
          styles={{
            label: {
              textTransform: "none",
              display: "flex",
              alignItems: "center",
            },
          }}
          maw={100}
          variant="light"
        >
          <CopyButton value={item.pdf_link} />
          <Text fz="xs" truncate={"end"}>
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
        <Group gap={"xs"} justify="flex-end">
          <Button
            loading={
              isGeneratingBook.isGenerating &&
              isGeneratingBook.bookId === item.$id
            }
            onClick={() => {
              setGenerateBookId(item.$id);
              openGenerateBookModal();
            }}
            variant="filled"
            color="rgba(0, 0, 0, 1)"
            size="xs"
          >
            Generate
          </Button>
          <Button
            onClick={() => {
              setDeleteBookId(item.$id);
              openDeleteBookModal();
            }}
            variant="outline"
            color="rgba(0, 0, 0, 1)"
            size="xs"
          >
            Delete
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer mb mx={"md"} minWidth={800}>
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
