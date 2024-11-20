import {
  Button,
  Divider,
  Group,
  Modal,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { ArrowCircleUp } from "@phosphor-icons/react";
import { generateContent } from "../server-functions/generateContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";

function BookListGenerateModal({
  isOpened,
  close,
  bookId,
  setIsGeneratingBook,
}) {
  const queryClient = useQueryClient();
  const {
    user: { id },
  } = useUser();

  const { mutateAsync: generateMoreBookContent } = useMutation({
    mutationFn: generateContent,
    onSuccess: () => {
      setIsGeneratingBook({ isGenerating: false, bookId: null });
      close();
      toast.success("6 blogs generated", {
        style: {
          backgroundColor: "rgba(0, 0, 0, 1)",
          color: "white",
        },
      });

      queryClient.invalidateQueries({ queryKey: ["book"] });
    },
    onError: () => {
      setIsGeneratingBook({ isGenerating: false, bookId: null });
      toast.error("Something went wrong", {
        style: {
          backgroundColor: "rgba(0, 0, 0, 1)",
          color: "white",
        },
      });
    },
  });
  const theme = useMantineTheme();
  return (
    <Modal
      radius={"xl"}
      styles={{
        header: {
          display: "none",
        },
        body: {
          padding: "1.5rem",
          paddingBottom: "1rem",
          paddingRight: "1.5rem",
          paddingLeft: "1.5rem",
        },
      }}
      centered
      opened={isOpened}
      bg={theme.colors.gray[0]}
      onClose={close}
      title="Authentication"
    >
      <Group gap={"xs"} wrap="nowrap">
        <ArrowCircleUp size={42} weight="fill" />
        <Title order={4} c={theme.colors.dark[9]} fw={500}>
          Generate More Content?
        </Title>
      </Group>
      <Divider my={"sm"} />
      <Text fz={"sm"} c={theme.colors.dark[9]}>
        ──Generate 5 blogs from this book?
      </Text>
      <Text fz={"sm"} c={theme.colors.dark[9]}>
        ──Takes upto 5-10 minutes based on the size of the book
      </Text>
      <Group gap={"sm"} justify="flex-end" mt="md" mb="xs">
        <Button
          c={theme.colors.dark[9]}
          onClick={close}
          variant="transparent"
          size="xs"
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            close();
            setIsGeneratingBook({ isGenerating: true, bookId });
            await generateMoreBookContent({ book_id: bookId, user_id: id });
          }}
          variant="light"
          c={theme.colors.gray[9]}
          size="xs"
        >
          Generate
        </Button>
      </Group>
    </Modal>
  );
}
export default BookListGenerateModal;
