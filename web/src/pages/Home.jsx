import BlogCard from "../components/BlogCard";
import {
  Button,
  Group,
  Skeleton,
  Stack,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { fetchBlogs } from "../appwrite/fetchBlogs";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";

export default function Home() {
  const {
    user: { id },
  } = useUser();
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  function BlogSkeleton() {
    return (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <Group
            key={i}
            wrap="nowrap"
            bg={
              colorScheme === "dark" ? "rgb(19, 27, 46)" : theme.colors.gray[0]
            }
            p={"lg"}
          >
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

  const {
    data: blogsData,
    isLoading: isBlogsLoading,
    isSuccess: isBlogsSuccess,
  } = useQuery({
    queryFn: () => fetchBlogs(id),
    queryKey: ["blogs"],
  });
  return (
    <Stack pb={"100"}>
      {isBlogsLoading && <BlogSkeleton />}
      {isBlogsSuccess &&
        blogsData.map((blog) => <BlogCard blog={blog} key={blog.$id} />)}
    </Stack>
  );
}
