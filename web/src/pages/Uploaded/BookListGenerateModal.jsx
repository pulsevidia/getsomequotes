import { Button, Divider, Group, Modal, Text, Title } from "@mantine/core";
import { ArrowCircleUp } from "@phosphor-icons/react";
import { generateContent } from "../../server-functions/generateContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function BookListGenerateModal({
  isOpened,
  close,
  bookId,
  setIsGeneratingBook,
}) {
  const queryClient = useQueryClient();

  const { mutateAsync: generateMoreBookContent } = useMutation({
    mutationFn: generateContent,
    onSuccess: () => {
      setIsGeneratingBook({ isGenerating: false, bookId: null });
      close();
      toast.success("6 blogs & 20 quotes generated", {
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
      onClose={close}
      title="Authentication"
    >
      <Group gap={"xs"} wrap="nowrap">
        <ArrowCircleUp size={42} weight="fill" />
        <Title order={4} fw={500}>
          Generate More Content?
        </Title>
      </Group>
      <Divider my={"sm"} />
      <Text fz={"sm"} color="dark">
        ──Generate 5 blogs and 20 quotes from this book?
      </Text>
      <Text fz={"sm"} color="dark">
        ──Takes upto 5-10 minutes based on the size of the book
      </Text>
      <Group gap={"sm"} justify="flex-end" mt="md" mb="xs">
        <Button
          onClick={close}
          variant="transparent"
          color="rgba(0, 0, 0, 1)"
          size="xs"
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            close();
            setIsGeneratingBook({ isGenerating: true, bookId });
            await generateMoreBookContent(bookId);
          }}
          variant="light"
          color="rgba(0, 0, 0, 1)"
          size="xs"
        >
          Generate
        </Button>
      </Group>
    </Modal>
  );
}
export default BookListGenerateModal;
