import { Card, Center, Loader, Stack, useComputedColorScheme } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { fetchBlogs } from "@/appwrite/fetchBlogs";
import BlogSkeleton from "../BlogSkeleton";
import BlogCard from "../BlogCard";
import NoContentAdded from "../NoContentAdded";
import { useInViewport } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { dark_theme } from "@/app/config/theme";

function AllBlogCards() {
  const { getToken } = useAuth()

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
    queryFn: () => fetchBlogs(getToken, offsetIndex),
    queryKey: ["blogs", offsetIndex],
  });

  useEffect(() => {
    if (blogsData) allBlogsData ? setAllBlogsData(oldData => [...oldData, ...blogsData]) : setAllBlogsData(() => [...blogsData])
  }, [isBlogsSuccess, blogsData])

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
      <Stack pb={"0"}>
        {allBlogsData && allBlogsData?.map((blog, i) => <BlogCard blog={blog} key={`${blog.$id}${i}`} />)}
        {isBlogsLoading && offsetIndex == 0 && <BlogSkeleton colorScheme={colorScheme} instances={7} />}
        <div ref={ref} style={{ margin: '1rem 0' }}></div>
        {isBlogsLoading &&
          <Card bg={'transparent'} m={0} w={'100%'}>
            <Center>
              <Loader size={'sm'} color={colorScheme === 'dark' ? dark_theme.main_text_color : 'dark'} />
            </Center>
          </Card>}
      </Stack>
    </>
  );
}
export default AllBlogCards;
