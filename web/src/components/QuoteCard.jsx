import { Text, Group, Stack } from "@mantine/core";

function QuoteCard({ quote }) {
  return (
    <Stack miw={300} maw={600} gap={0}>
      {/* <Group pl={"xl"} py={"md"}  style={{ borderLeft: "8px solid rgb(115, 87, 217)" }}> */}
      <Group pl={"xl"} py={"md"} style={{ borderLeft: "5px solid #868e96" }}>
        <Text
          size="lg"
          c={"dark"}
          style={{
            fontFamily: "Cirular medium, sans-serif",
            lineHeight: "1.5",
          }}
          fw={500}
        >
          {quote ||
            "To believers in the justified-true-belief theory of knowledge, this recognition is the occasion for despair or cynicism, because to them it means that know- ledge is unattainable. But to those of us for whoms creating knowledge means understanding better what is really there,and how it really behaves and why, fallibilism is part of the very means by which this is achieved."
          }
        </Text>
      </Group>
      {/* <Text
        w={"100%"}
        c={"black"}
        style={{
          fontFamily: "Cirular medium, sans-serif",
        }}
        ta={"right"}
      >
        —The Beginning of Infinity
      </Text> */}
    </Stack>
  );
}
export default QuoteCard;