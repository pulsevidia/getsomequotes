import { Text, Group, Stack } from "@mantine/core";

function QuoteCard({ quote }) {
  return (
    <Stack miw={300} maw={600} gap={0}>
      <Group
        pl={"xl"}
        py={"md"}
        style={{ borderLeft: "8px solid rgb(115, 87, 217)" }}
      >
        <Text
          size="xl"
          c={"dark"}
          style={{
            fontFamily: "Circular, sans-serif",
            lineHeight: "1.5",
          }}
          fw={500}
        >
          {quote}
        </Text>
      </Group>
    </Stack>
  );
}
export default QuoteCard;
