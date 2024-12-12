"use client";
import "./Uploaded.css";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Group, Button, Divider, useMantineTheme, useComputedColorScheme } from "@mantine/core";
import { fetchBook } from "../../appwrite/fetchBook";
import { useQuery } from "@tanstack/react-query";
import { Book } from "@phosphor-icons/react";
import BookList from "../components/BookList";
import BookListSkeleton from "../components/BookListSkeleton";
import BookListDeleteModal from "../components/BookListDeleteModal";
import BookListGenerateModal from "../components/BookListGenerateModal";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { cardShadows } from "../utils/shadows";
import { dark_theme } from "../config/theme";
import { useModelContext } from "../contexts/ModelProvider";

export default function Uploaded() {
  const smallSizeMath = useMediaQuery("(max-width:480px)");
  const {
    user: { id },
  } = useUser();
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const { open } = useModelContext();

  const [isDeleteBookModalOpened, { open: openDeleteBookModal, close: closeDeleteBookModal }] = useDisclosure();
  const [isGenerateBookModalOpened, { open: openGenerateBookModal, close: closeGenerateBookModal }] = useDisclosure();
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
    queryFn: () => fetchBook(id),
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  return (
    <>
      <BookListDeleteModal isOpened={isDeleteBookModalOpened} close={closeDeleteBookModal} bookId={deleteBookId} />
      <BookListGenerateModal
        setIsGeneratingBook={setIsGeneratingBook}
        isOpened={isGenerateBookModalOpened}
        close={closeGenerateBookModal}
        bookId={generateBookId}
      />
      <Group>
        <Button
          leftSection={<Book size={16} />}
          onClick={open}
          color={colorScheme === "dark" ? dark_theme.secondary_text_color : theme.colors.gray[2]}
          c={colorScheme === "dark" ? dark_theme.nav_link_dark_color : theme.colors.dark[9]}
          radius={"md"}
          fullWidth={smallSizeMath}
          mx={"md"}
          style={{
            boxShadow: `${cardShadows.xl}`,
          }}
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
