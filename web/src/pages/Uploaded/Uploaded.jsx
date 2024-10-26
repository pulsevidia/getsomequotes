// Styles
import "./Uploaded.css";
// Mantine components and hooks
import { useDisclosure } from "@mantine/hooks";
import { Group, rem, Modal, Button, LoadingOverlay } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { fetchBook } from "../../appwrite/fetchBook";
import { useMutation, useQuery } from "@tanstack/react-query";
import { postPDF } from "../../server-functions/postPDF";
import { Book, XCircle, UploadSimple } from "@phosphor-icons/react";
import BookList from "./BookList";
import BookListSkeleton from "./BookListSkeleton";
import BookListDeleteModal from "./BookListDeleteModal";
import BookListGenerateModal from "./BookListGenerateModal";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Uploaded() {
  const [opened, { open, close }] = useDisclosure(false);
  const [
    isDeleteBookModalOpened,
    { open: openDeleteBookModal, close: closeDeleteBookModal },
  ] = useDisclosure();
  const [
    isGenerateBookModalOpened,
    { open: openGenerateBookModal, close: closeGenerateBookModal },
  ] = useDisclosure();
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [generateBookId, setGenerateBookId] = useState(null);
  const [isGeneratingBook, setIsGeneratingBook] = useState({
    isGenerating: false,
    bookId: null,
  });

  const {
    data: books,
    isSuccess: isBooksSuccess,
    isLoading: isBooksLoading,
  } = useQuery({
    queryKey: ["book"],
    queryFn: fetchBook,
    cacheTime: Infinity,
  });

  const { mutateAsync: postThePDF, status } = useMutation({
    mutationFn: postPDF,
    onSuccess: () => {
      toast.success("Book sent successfully");
      close();
    },
    onError: () => {
      close();
      toast.error("Something went wrong");
    },
  });

  // status can be idle, pending, success, error

  return (
    <>
      <LoadingOverlay
        Index={19000}
        overlayProps={{ radius: "sm", blur: 2 }}
        visible={status == "pending"}
      />

      <BookListDeleteModal
        isOpened={isDeleteBookModalOpened}
        close={closeDeleteBookModal}
        bookId={deleteBookId}
      />
      <BookListGenerateModal
        setIsGeneratingBook={setIsGeneratingBook}
        isOpened={isGenerateBookModalOpened}
        close={closeGenerateBookModal}
        bookId={generateBookId}
      />

      <Modal
        radius={"xl"}
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
          styles={{
            root: {
              border: "none",
            },
          }}
          onDrop={async (files) => {
            try {
              await postThePDF(files);
            } catch (e) {
              console.error(e);
            }
          }}
          onReject={() => {
            toast.error("Should not exceed 5MB");
          }}
          maxSize={6* 1024 ** 2}
          accept={PDF_MIME_TYPE}
        >
          <Group
            justify="center"
            gap="xl"
            mih={220}
            style={{ pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <UploadSimple size={rem(52)} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <XCircle size={rem(52)} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-book-upload"
                width="60"
                height="60"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#2c3e50"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M14 20h-8a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12v5" />
                <path d="M11 16h-5a2 2 0 0 0 -2 2" />
                <path d="M15 16l3 -3l3 3" />
                <path d="M18 13v9" />
              </svg>
            </Dropzone.Idle>
          </Group>
        </Dropzone>
      </Modal>
      <Group>
        <Button
          style={{
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
          }}
          variant=""
          leftSection={<Book size={16} />}
          onClick={open}
          color="black"
          fullWidth
          m={"md"}
        >
          Add more books
        </Button>
      </Group>
      <Group>
        {isBooksLoading && <BookListSkeleton />}
        {isBooksSuccess && (
          <BookList
            data={books}
            isGeneratingBook={isGeneratingBook}
            setIsGeneratingBook={setIsGeneratingBook}
            openGenerateBookModal={openGenerateBookModal}
            openDeleteBookModal={openDeleteBookModal}
            setDeleteBookId={setDeleteBookId}
            setGenerateBookId={setGenerateBookId}
          />
        )}
      </Group>
    </>
  );
}
