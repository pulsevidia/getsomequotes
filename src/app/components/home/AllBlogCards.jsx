import { Center, Stack, useComputedColorScheme } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { fetchBlogs } from "@/appwrite/fetchBlogs";
import BlogSkeleton from "../BlogSkeleton";
import BlogCard from "../BlogCard";
import NoContentAdded from "../NoContentAdded";
import { useInViewport } from "@mantine/hooks";
import { useEffect, useState } from "react";

function AllBlogCards() {
  const {
    user: { id },
  } = useUser();

  const colorScheme = useComputedColorScheme();
  const { ref, inViewport } = useInViewport();
  const [offsetIndex, setOffsetIndex] = useState(0)
  const [allBlogsData, setAllBlogsData] = useState(null)

  const {
    data: blogsData,
    isLoading: isBlogsLoading,
    isSuccess: isBlogsSuccess,
    refetch
  } = useQuery({
    queryFn: () => fetchBlogs(id, offsetIndex),
    queryKey: ["blogs", offsetIndex],
  });

  useEffect(() => {
    if (blogsData) allBlogsData ? setAllBlogsData(oldData => [...oldData, ...blogsData]) : setAllBlogsData(() => [...blogsData])
  }, [isBlogsSuccess, blogsData ])

  useEffect(() => { if (isBlogsSuccess && !isBlogsLoading && inViewport) setOffsetIndex(i => i + 1) }, [inViewport])

  useEffect(() => {
    if (offsetIndex > 0) {
      refetch()
    }
  }, [offsetIndex, refetch])

  return (
    <>
      {isBlogsSuccess && allBlogsData && allBlogsData.length === 0 && (
        <Center h={'80vh'}>
          <NoContentAdded />
        </Center>
      )}

      <Stack pb={"100"}>
        {allBlogsData && allBlogsData?.map((blog) => <BlogCard blog={blog} key={blog.$id} />)}
        {isBlogsLoading && offsetIndex == 0 && <BlogSkeleton colorScheme={colorScheme} instances={7} />}
        <div ref={ref} style={{ margin: '1rem 0' }}></div>
      </Stack>
    </>
  );
}
export default AllBlogCards;
