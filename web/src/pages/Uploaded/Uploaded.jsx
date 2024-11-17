// Styles
import "./Uploaded.css";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  Group,
  Modal,
  Button,
  Stack,
  Input,
  Card,
  BackgroundImage,
  Text,
  ActionIcon,
  Divider,
} from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { fetchBook } from "../../appwrite/fetchBook";
import { useMutation, useQuery } from "@tanstack/react-query";
import { postPDF } from "../../server-functions/postPDF";
import { Book, FileArrowUp, Sparkle, Trash } from "@phosphor-icons/react";
import BookList from "./BookList";
import BookListSkeleton from "./BookListSkeleton";
import BookListDeleteModal from "./BookListDeleteModal";
import BookListGenerateModal from "./BookListGenerateModal";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";

export default function Uploaded() {
  const smallSizeMath = useMediaQuery("(max-width:480px)");
  const {
    user: { id },
  } = useUser();

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

  const [currentImage, setCurrentImage] = useState(null);
  const imageArray = [
    "1-5Z7BuzVnrVbWrXx9ZA2bhkUEhIgRb9.jpg",
    "10-zSeaqglQsBG354rs0uFQtV3CDhCclz.png",
    "11-KXmnPrBxCX3GBE9piYRzpHgP1qht0l.png",
    "12-5FVmKTerKVfPVyrLYO0QaSDMC0rh4I.png",
    "13-ra4FdCQGIEo2bZ5twJ2xKyS7grQiG7.jpg",
    "14-EAVsS2CfniRJYv5RJL3Cbkyh7Zorgi.png",
    "15-ZT2pSfX2IL59OKMeYa6AmdroV2jqMx.jpg",
    "2-oxt9IKmB1AdyDpkLs1itkBiKFs27nn.png",
    "3-gMcdEKOQCRZ9bg8kSezvTxEZQPOQ2v.jpg",
    "4-Uro718UPbvu7GYyv8T6uDqPpIFkh8j.jpg",
    "5-lTIYYlQpguMZKCA2yF49l3oCnAcWhn.png",
    "6-pZNOgN4gAJxJX5QZvTdRrYZxz5AHh9.png",
    "7-eZLEPTNLv6bFLUDdY6ykH9MuAk6Qau.png",
    "8-nShlQLtti1gelaByNwASMi3jU96te2.png",
    "9-AkBiHFTUPyViVMy1pKyUjfyG5Capoa.png",
  ];

  function chooseRandomImage() {
    setCurrentImage(
      `https://viqwjhprxs3j5sad.public.blob.vercel-storage.com/image_4_books/${
        imageArray[Math.floor(Math.random() * imageArray.length)]
      }`
    );
  }

  const [book, setBook] = useState(null);
  const [authorName, setAuthorName] = useState(null);
  const [bookTitle, setBookTitle] = useState(null);

  const {
    data: books,
    isSuccess: isBooksSuccess,
    isLoading: isBooksLoading,
  } = useQuery({
    queryKey: ["book"],
    queryFn: () => fetchBook(id),
    cacheTime: Infinity,
  });
  const { mutateAsync: postThePDF, status } = useMutation({
    mutationFn: postPDF,
    onSuccess: () => {
      toast.success("Book sent successfully");
      close();
      setBook(null);
      setAuthorName(null);
      setBookTitle(null);
    },
    onError: () => {
      close();
      setBook(null);
      setAuthorName(null);
      setBookTitle(null);
      toast.error("Your book is too short, try bigger one!");
    },
  });
  // status can be idle, pending, success, error

  return (
    <>
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
          content: {
            maxWidth: "310px",
          },
          body: {
            paddingTop: "2rem",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            paddingBottom: "2rem",
          },
          header: {
            display: "none",
          },
        }}
        opened={opened}
        onClose={status !== "pending" && close}
        title="upload"
      >
        <Stack gap={"0"} miw={230}>
          <Input.Wrapper label="Author Name">
            <Input
              disabled={status === "pending"}
              radius={"md"}
              variant="filled"
              size="sm"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Ex: Richard Dawkins"
            />
          </Input.Wrapper>

          <Input.Wrapper label="Book Title">
            <Input
              disabled={status === "pending"}
              radius={"md"}
              variant="filled"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              size="sm"
              placeholder="The Selfish Gene"
            />
          </Input.Wrapper>
        </Stack>

        {book && (
          <Card bg={"#f1f3f5"} mt={"sm"} padding="xs" radius="xl">
            <Group justify="space-between">
              <Group>
                <BackgroundImage
                  onClick={chooseRandomImage}
                  src={currentImage}
                  radius="xl"
                />
                <Stack gap={0}>
                  <Text
                    maw={134}
                    truncate={"end"}
                    style={{ lineHeight: 1.1, fontFamily: "Afacad Flux" }}
                  >
                    {bookTitle}
                  </Text>
                  <Text
                    maw={134}
                    truncate={"end"}
                    style={{ lineHeight: 1.1 }}
                    size="xs"
                    c={"gray"}
                  >
                    {authorName && "By: "}
                    {authorName}
                  </Text>
                  {/* <Text mt={'5'} style={{ lineHeight: 1.1 }} size="xs" c={"gray"}>
                  PDF &nbsp; 2.2MB
                </Text> */}
                </Stack>
              </Group>
              <ActionIcon
                disabled={status === "pending"}
                onClick={() => setBook(null)}
                mr={"xs"}
                variant="transparent"
                color="red"
                aria-label="Settings"
              >
                <Trash size={18} color="#ed333b" />
              </ActionIcon>
            </Group>
          </Card>
        )}
        {authorName && bookTitle && !book ? (
          <Dropzone
            styles={{
              root: {
                border: "none",
                padding: 0,
              },
            }}
            onDrop={async (file) => {
              setBook(file);
              chooseRandomImage();
            }}
            onReject={() => {
              toast.error("Should not exceed 5MB");
            }}
            maxSize={6 * 1024 ** 2}
            accept={PDF_MIME_TYPE}
          >
            <Group justify="center" gap="xl" style={{ pointerEvents: "none" }}>
              <Dropzone.Idle>
                <Button
                  variant="light"
                  mt={"md"}
                  leftSection={<FileArrowUp size={18} />}
                  size="sm"
                  fullWidth
                  color="black"
                  radius="md"
                >
                  Upload
                </Button>
              </Dropzone.Idle>
            </Group>
          </Dropzone>
        ) : null}
        {book && (
          <Button
            variant="filled"
            mt={"md"}
            styles={{ section: { marginInlineEnd: "5px" } }}
            leftSection={<Sparkle size={18} color="#f6f5f4" weight="fill" />}
            size="sm"
            fullWidth
            fw={400}
            color="black"
            radius="md"
            loaderProps={{ type: "dots" }}
            loading={status === "pending"}
            onClick={async () =>
              await postThePDF({
                id,
                file: book,
                authorName,
                bookTitle,
                currentImage,
              })
            }
          >
            Generate
          </Button>
        )}
      </Modal>
      <Group>
        <Button
          variant="light"
          leftSection={<Book size={16} />}
          onClick={open}
          color="dark"
          radius={"md"}
          fullWidth={smallSizeMath}
          mx={"md"}
        >
          Add more books
        </Button>
      </Group>
      <Divider m={"md"} />
      <Group pb={"100"} gap={"xs"}>
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
