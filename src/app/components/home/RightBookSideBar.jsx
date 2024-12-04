import { fetchBook } from "@/appwrite/fetchBook";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import BookCards from "../bottom-bar/BookCards";
import LoadingSkeleton from "../bottom-bar/Skeleton";
import { ScrollArea, Stack, useComputedColorScheme } from "@mantine/core";
import { memo, useState } from "react";
import ActiveBookCard from "../bottom-bar/ActiveBookCard";

function RightBookSidebar() {
  const colorScheme = useComputedColorScheme();
  const [activeBook, setActiveBook] = useState(null);
  const {
    user: { id },
  } = useUser();

  const {
    data: books,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["book"],
    queryFn: () => fetchBook(id),
    cacheTime: Infinity,
  });

  return (
    <ScrollArea
      // bg={colorScheme == "dark" ? "rgb(11, 9, 28)" : theme.colors.gray[0]}
      scrollbarSize={6}
      h={"100vh"}
      scrollbars="y"
    >
      <Stack gap="xs" ml={"sm"} m="xs">
        {activeBook && <ActiveBookCard colorScheme={colorScheme} {...activeBook} />}

        {isSuccess &&
          books.map(
            (data, i) =>
              data.$id !== activeBook?.$id && (
                <BookCards setActiveBook={setActiveBook} key={i} {...data} colorScheme={colorScheme} />
              )
          )}
        {isSuccess &&
          books.map(
            (data, i) =>
              data.$id !== activeBook?.$id && (
                <BookCards setActiveBook={setActiveBook} key={i} {...data} colorScheme={colorScheme} />
              )
          )}

        {isLoading && <LoadingSkeleton colorScheme={colorScheme} />}
      </Stack>
    </ScrollArea>
  );
}
export default memo(RightBookSidebar);
