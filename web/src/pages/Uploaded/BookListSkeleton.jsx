import { Group, Skeleton, Stack, useMantineTheme } from "@mantine/core";

function BookListSkeleton() {
  const theme = useMantineTheme();
  return (
    <Group maw={480} miw={300} m={"md"} w={"100%"} gap={"xs"}>
      {Array.from({ length: 20 }).map((_, index) => (
        <Group
          bg={theme.colors.gray[1]}
          w={"100%"}
          key={index}
          height={78}
          p={"sm"}
          style={{ borderRadius: "10px" }}
          wrap="nowrap"
          align="flex-start"
        >
          <Skeleton height={40} width={40} radius="md" />
          <Stack gap={"xs"}>
            <Skeleton w={"250"} height={12} />
            <Skeleton w={150} height={9} />
            <Skeleton w={100} height={7} />
          </Stack>
        </Group>
      ))}
    </Group>
  );
}
export default BookListSkeleton;
