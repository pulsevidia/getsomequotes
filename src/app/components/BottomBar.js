import React, { useMemo } from "react";
import styles from "./BottomBar.module.css";
import { House, FileArrowUp, UploadSimple } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { dark_theme } from "../config/theme";
import { ScrollArea, Stack, useComputedColorScheme, useMantineTheme } from "@mantine/core";
import { useResizeObserver, useToggle } from "@mantine/hooks";
import { fetchBook } from "@/appwrite/fetchBook";
import LoadingSkeleton from "./bottom-bar/Skeleton";
import BookCards from "./bottom-bar/BookCards";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";

const BottomBar = () => {
  const [isExpanded, toggleExpanded] = useToggle();
  const pathname = usePathname();
  const colorScheme = useComputedColorScheme();
  const [ref] = useResizeObserver();
  const theme = useMantineTheme();
  const router = useRouter();
  const {
    user: { id },
  } = useUser();

  const {
    data: books,
    isSuccess: isBooksSuccess,
    isLoading: isBooksLoading,
  } = useQuery({
    queryKey: ["book"],
    queryFn: () => fetchBook(id),
    cacheTime: Infinity,
  });

  const iconColor = useMemo(
    () => (colorScheme === "dark" ? dark_theme.main_text_color : theme.colors.gray[9]),
    [colorScheme, theme.colors.gray]
  );
  const navigationOptions = useMemo(
    () => [
      { name: "/", icon: <House size={80} /> },
      { name: "/upload_book", icon: <UploadSimple size={80} /> },
      { name: "/uploaded", icon: <FileArrowUp size={80} /> },
    ],
    []
  );

  const handleNavigation = (name) => {
    if (name === "/upload_book") {
      toggleExpanded();
    } else {
      router.push(name);
      isExpanded && toggleExpanded();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "3%",
        zIndex: 2323,
        padding: "1rem",
        display: "grid",
        width: "100%",
        placeItems: "center",
      }}
    >
      <div
        style={{
          maxHeight: "300px",
          background: colorScheme === "dark" ? dark_theme.nav_link_dark_color : "white",
          padding: "8px",
        }}
        className={styles.nav_parent}
      >
        <ScrollArea
          ref={ref}
          bg={colorScheme == "dark" ? "rgb(11, 9, 28)" : theme.colors.gray[3]}
          scrollbarSize={2}
          h={isExpanded ? 300 : 0}
          style={{ transition: "0.4s", borderRadius: "30px" }}
          scrollbars="y"
        >
          <Stack gap="xs" m="xs">
            {isBooksSuccess &&
              books.map((data, i) => <BookCards key={i} {...data} colorScheme={colorScheme} toggle={toggleExpanded} />)}
            {isBooksLoading && <LoadingSkeleton colorScheme={colorScheme} />}
          </Stack>
        </ScrollArea>
        <nav className={styles.nav}>
          {navigationOptions.map((item) => (
            <a
              key={item.name}
              className={`${styles.link} ${pathname === item.name ? styles.active : ""}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.name);
              }}
              style={{ "--hover-bg": `${iconColor}20`, "--hover-c": iconColor }}
            >
              {item.icon}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};
export default BottomBar;
