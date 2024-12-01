import { Group, Skeleton, Stack, useMantineTheme } from "@mantine/core";

export default function BlogSkeleton({ colorScheme, instances }) {
  const theme = useMantineTheme();
  return (
    <>
      {Array.from({ length: instances }).map((_, i) => (
        <Group key={i} wrap="nowrap" bg={colorScheme === "dark" ? undefined : theme.colors.gray[0]} p={"lg"}>
          <Skeleton height={80} width={80} />
          <Stack gap={"xs"}>
            <Skeleton mb={"xs"} height={13} radius={"xl"} width={100} />
            <Skeleton height={13} radius={"xl"} width={200} />
            <Skeleton height={13} radius={"xl"} width={200} />
          </Stack>
        </Group>
      ))}
    </>
  );
}
