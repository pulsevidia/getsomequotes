import {
  Card,
  Text,
  Badge,
  Group,
  BackgroundImage,
  Stack,
  Title,
  useMantineTheme,
  useComputedColorScheme,
} from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";
import removeMarkdown from "markdown-to-text";
import { cardShadows } from "../utils/shadows";
import { useMemo } from "react";
import Link from "next/link";

import { DM_Sans, Afacad_Flux, } from "next/font/google";

const dm_sans = DM_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const afacad_flux = Afacad_Flux({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const allImage = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
  "13.webp",
  "14.jpg",
  "15.jpg",
  "16.jpg",
  "17.webp",
  "18.webp",
  "19.webp",
  "20.webp",
  "21.webp",
  "22.webp",
  "23.webp",
  "24.jpg",
];

function BlogCard({ blog }) {
  function extractFirstLine(blog) {
    const start = blog.blog_markdown.indexOf("##");
    if (start === -1) return null;

    const end = blog.blog_markdown.indexOf("\n", start);
    if (end === -1) return null;

    const what = [blog.blog_markdown.slice(start + 2, end).trim()];
    return what;
  }

  const title = useMemo(() => extractFirstLine(blog), [blog]);
  const content = useMemo(() => removeMarkdown(blog.blog_markdown), [blog]);
  const smallSizeMath = useMediaQuery("(max-width:480px)");
  const randomImage = useMemo(() => allImage[Math.floor(Math.random() * allImage.length)], []);

  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  return (
    <Link href={`/blog/${blog.$id}`} style={{ textDecoration: "none" }}>
      <Card
        shadow={cardShadows.md}
        maw={600}
        // mih={150}
        style={{ cursor: "pointer" }}
        mx={"xs"}
        radius={"sm"}
        styles={{ root: { padding: 0 } }}
        bg={colorScheme === "dark" ? "rgb(19, 27, 46)" : theme.colors.gray[0]}
      >
        <Group gap={"xs"} style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
          <BackgroundImage
            style={{
              boxShadow: cardShadows.xs,
            }}
            loading="lazy"
            miw={smallSizeMath ? 120 : 140}
            mih={smallSizeMath ? 167 : 150}
            p={40}
            src={`/images_4_blogs/${randomImage}`}
          ></BackgroundImage>

          <Stack pr={"sm"} py={"sm"} gap={0}>
            <Group mb={"xs"} gap={"xs"} align="flex-start">
              <Badge
                variant="light"
                className={afacad_flux.className}
                style={{
                  boxShadow: cardShadows.xs,
                }}
                size={smallSizeMath ? "xs" : "sm"}
                color={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[6]}
              >
                {blog?.books?.book_name}
              </Badge>
              <Text
              miw={200}
                size="xs"
                fw={600}
                c={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[6]}
                className={dm_sans.className}
              >
                {blog.books?.author || "Unknown"}
              </Text>
            </Group>
            <Title
              lineClamp={2}
              fw={600}
              className={dm_sans.className}
              style={{
                lineHeight: 1.1,
              }}
              mb={"xs"}
              size={smallSizeMath ? "18px" : "20px"}
              c={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[9]}
            >
              {title}
            </Title>
            <Text
              c={colorScheme === "dark" ? "rgb(182, 141, 133)" : theme.colors.gray[5]}
              fw={500}
              lineClamp={2}
              size="sm"
              className={dm_sans.className}
            >
              {content}
            </Text>
          </Stack>
        </Group>
      </Card>
    </Link>
  );
}
export default BlogCard;
