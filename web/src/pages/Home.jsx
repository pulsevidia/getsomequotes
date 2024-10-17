import BlogCard from "../components/BlogCard";
import { Stack } from "@mantine/core";
import { fetchBlogs } from "../appwrite/fetchBlogs";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: blogsData, isLoading: isBlogsLoading, isSuccess: isBlogsSuccess } = useQuery({
    queryFn: () => fetchBlogs(),
    queryKey: ["blogs"]
  })

  return (
    <Stack>
      {isBlogsLoading && <div>Loading...</div>}
      {isBlogsSuccess && blogsData.map(blog => <BlogCard blog={blog} key={blog.$id} />)}
    </Stack>
  );
}