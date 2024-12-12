'use client'
import {
  Group,
  Stack,
  Modal,
  Button,
  Input,
  Card,
  BackgroundImage,
  Text,
  ActionIcon,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { FileArrowUp, Sparkle, Trash } from "@phosphor-icons/react";
import { dark_theme } from "@/app/config/theme";
import "./Uploaded.css";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import toast from "react-hot-toast";
import { cardShadows } from "@/app/utils/shadows";
import { afacad_flux } from "@/app/font";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useModelContext } from "../contexts/ModelProvider";
import { useUser } from "@clerk/clerk-react";
import { postPDF } from "../server-functions/postPDF";

function PDFUploadModalProvider() {
  const { user } = useUser();
  const theme = useMantineTheme();
  const { opened, close } = useModelContext();
  const [currentImage, setCurrentImage] = useState(null);
  const imageArray = Array.from({ length: 100 }, (_, i) => `${i + 1}.jpg`);

  function chooseRandomImage() {
    setCurrentImage(`/compress-cats/${imageArray[Math.floor(Math.random() * imageArray.length)]}`);
  }

  const [book, setBook] = useState(null);
  const [authorName, setAuthorName] = useState(null);
  const [bookTitle, setBookTitle] = useState(null);

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
  const colorScheme = useComputedColorScheme();
  return (
    <Modal
      radius={"xl"}
      centered
      styles={{
        content: {
          maxWidth: "310px",
        },
        body: {
          background: colorScheme === "dark" ? dark_theme.app_bg_dark_color : "white",
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
        <Input.Wrapper c={colorScheme === "dark" ? dark_theme.secondary_text_color : "dark"} l label="Book Title">
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
        <Input.Wrapper c={colorScheme === "dark" ? dark_theme.secondary_text_color : "dark"} label="Author Name">
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
      </Stack>

      {book && (
        <Card
          shadow={cardShadows.md}
          bg={colorScheme === "dark" ? dark_theme.nav_link_dark_color : "#f1f3f5"}
          mt={"sm"}
          padding="xs"
          radius="xl"
        >
          <Group wrap="nowrap" justify="space-between">
            <Group wrap="nowrap" gap={"xs"}>
              <BackgroundImage onClick={chooseRandomImage} src={currentImage} radius="xl" h={36} w={36} />
              <Stack gap={0}>
                <Text maw={140} className={afacad_flux.className} truncate={"end"} style={{ lineHeight: 1.1 }}>
                  {bookTitle}
                </Text>
                <Text maw={140} truncate={"end"} style={{ lineHeight: 1.1 }} size="xs" c={"gray"}>
                  {authorName && "By: "}

                  {authorName}
                </Text>
              </Stack>
            </Group>
            <ActionIcon
              disabled={status === "pending"}
              onClick={() => setBook(null)}
              mr={"xs"}
              size={"lg"}
              radius={"xl"}
              variant="light"
              color="red"
              aria-label="Settings"
            >
              <Trash size={19} color="#ed333b" />
            </ActionIcon>
          </Group>
        </Card>
      )}
      {/* {authorName && bookTitle && !book ? ( */}
      <Dropzone
        styles={{
          root: {
            border: "none",
            padding: 0,
            background: "none",
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
        {!book && (
          <Group mt={"md"} justify="center" gap="xl" style={{ pointerEvents: "none" }}>
            <Dropzone.Idle>
              <Button
                style={{ boxShadow: cardShadows.md }}
                variant="light"
                leftSection={<FileArrowUp size={18} />}
                size="sm"
                c={colorScheme === "dark" ? dark_theme.secondary_text_color : "black"}
                bg={colorScheme === "dark" ? dark_theme.nav_link_dark_color : theme.colors.gray[2]}
                fullWidth
                radius="md"
              >
                Upload
              </Button>
            </Dropzone.Idle>
          </Group>
        )}
      </Dropzone>
      {/* ) : null} */}
      {book && (
        <Button
          variant="filled"
          mt={"md"}
          styles={{ section: { marginInlineEnd: "5px" } }}
          style={{ boxShadow: cardShadows.md }}
          leftSection={
            <Sparkle color={colorScheme === "dark" ? dark_theme.main_text_color : "white"} size={18} weight="fill" />
          }
          size="sm"
          fullWidth
          fw={400}
          c={colorScheme === "dark" ? dark_theme.main_text_color : "white"}
          bg={colorScheme === "dark" ? dark_theme.nav_link_dark_color : "black"}
          radius="md"
          loaderProps={{ type: "dots", color: colorScheme === "dark" ? dark_theme.secondary_text_color : "dark" }}
          loading={status === "pending"}
          onClick={async () => {
            await postThePDF({
              id: user.id,
              file: book,
              authorName,
              bookTitle,
              currentImage,
            });
          }}
        >
          Generate
        </Button>
      )}
    </Modal>
  );
}
export default PDFUploadModalProvider;
