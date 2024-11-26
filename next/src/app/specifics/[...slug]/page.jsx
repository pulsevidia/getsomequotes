"use client";
import { Stack, useComputedColorScheme } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { fetchBlogsWithIdArray } from "@/appwrite/fetchBlogs";
import { useParams } from "next/navigation";
import BlogCard from "@/app/components/BlogCard";
import BlogSkeleton from "@/app/components/BlogSkeleton";

export default function Specifics() {
  const { slug } = useParams();
  const {
    user: { id: user_id },
  } = useUser();

  const colorScheme = useComputedColorScheme();

  const {
    data: blogsData,
    isLoading: isBlogsLoading,
    isSuccess: isBlogsSuccess,
  } = useQuery({
    queryFn: () => fetchBlogsWithIdArray({ idsArray: slug, user_id }),
  });

  return (
    <Stack pb={"100"}>
      {isBlogsLoading && <BlogSkeleton colorScheme={colorScheme} instances={10} />}
      {isBlogsSuccess && blogsData.map((blog) => <BlogCard blog={blog} key={blog.$id} />)}
    </Stack>
  );
}
