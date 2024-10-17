// Styles
import "./Uploaded.css";
// Mantine components and hooks
import { useDisclosure } from "@mantine/hooks";
import { Group, Text, rem, Modal, Button, Card, Badge } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { fetchBook } from "../appwrite/fetchBook";
import { useMutation, useQuery } from "@tanstack/react-query";
import { postPDF } from "../server-functions/postPDF";
import { Book, XCircle, UploadSimple } from "@phosphor-icons/react";

function BookAndOperations({ bookName, blogCount, quoteCount }) {
  return (
    <Card miw={300} maw={300} shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>The Beginning Of Infinity</Text>
        <Text>Blogs: {blogCount}</Text>
        <Text>Quotes: {quoteCount}</Text>
      </Group>

      <Button color="blue" fullWidth mt="md" radius="md">
        Generate More Blogs
      </Button>

      <Button color="blue" fullWidth mt="md" radius="md">
        Generate More Quotes
      </Button>
    </Card>
  );
}

export default function Uploaded() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: books, isSuccess: isBooksSuccess, isLoading: isBooksLoading } = useQuery({
    queryKey: ["book"],
    queryFn: fetchBook,
    staleTime: Infinity
  })

  const { mutateAsync: postThePDF } = useMutation({
    mutationFn: postPDF
  })

  return (
    <>
      <Modal
        centered
        styles={{
          body: {
            paddingTop: "16px",
          },
          header: {
            display: "none",
          },
        }}
        opened={opened}
        onClose={close}
        title="upload"
      >
        <Dropzone
          onDrop={async (files) => {
            try {
              await postThePDF(files, close)
              close()
            } catch (e) {
              console.error(e)
            }
          }}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={5 * 1024 ** 2}
          accept={PDF_MIME_TYPE}
        >
          <Group
            justify="center"
            gap="xl"
            mih={220}
            style={{ pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <UploadSimple size={rem(52)} weight="duotone" />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <XCircle size={rem(52)} weight="duotone" />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <Book size={rem(52)} weight="duotone" />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Click here to upload PDF, books
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed
                5mb
              </Text>
            </div>
          </Group>
        </Dropzone>
      </Modal>
      <Group>
        <Button
          variant="outline"
          leftSection={<Book size={16} />}
          color="dark"
          onClick={open}
          mb={"md"}
        >
          Add more books

        </Button>
      </Group>
      <Group>
        {isBooksLoading && <h1>Loading...</h1>}
        {isBooksSuccess && books.map(book => <BookAndOperations blogCount={book.blogs.length} quoteCount={book.quotes.length} />)}
      </Group>
    </>
  );
}
