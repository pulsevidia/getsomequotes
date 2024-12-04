import { Stack, useComputedColorScheme } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { fetchBlogs } from "@/appwrite/fetchBlogs";
import BlogSkeleton from "../BlogSkeleton";
import BlogCard from "../BlogCard";

function AllBlogCards() {
  const {
    user: { id },
  } = useUser();

  const colorScheme = useComputedColorScheme();

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
      {isBlogsLoading && <BlogSkeleton colorScheme={colorScheme} instances={10} />}
      {isBlogsSuccess && blogsData.map((blog) => <BlogCard blog={blog} key={blog.$id} />)}
    </Stack>
  );
}
export default AllBlogCards;
