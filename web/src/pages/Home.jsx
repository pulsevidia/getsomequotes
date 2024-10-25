import BlogCard from "../components/BlogCard";
import { Group, Skeleton, Stack } from "@mantine/core";
import { fetchBlogs } from "../appwrite/fetchBlogs";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  function BlogSkeleton() {
    return (
      <>
        {
          Array.from({ length: 10 }).map((_, i) => <Group key={i} wrap="nowrap" p={'lg'}>
            <Skeleton height={80} width={80} />
            <Stack gap={'xs'}>
              <Skeleton mb={'xs'} height={13} radius={'xl'} width={100} />
              <Skeleton height={13} radius={'xl'} width={200} />
              <Skeleton height={13} radius={'xl'} width={200} />
            </Stack>
          </Group>
          )
        }
      </>
    )
  }

  const { data: blogsData, isLoading: isBlogsLoading, isSuccess: isBlogsSuccess } = useQuery({
    queryFn: () => fetchBlogs(),
    queryKey: ["blogs"]
  })

  return (
    <Stack>
      {isBlogsLoading && <BlogSkeleton />}
      {isBlogsSuccess && blogsData.map(blog => <BlogCard blog={blog} key={blog.$id} />)}
    </Stack>
  );
}