"use client";
import { Stack, useComputedColorScheme } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogs } from "@/appwrite/fetchBlogs";
import { useUser } from "@clerk/nextjs";
import BlogCard from "../components/BlogCard";
import BlogSkeleton from "../components/BlogSkeleton";

export default function Home() {
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
