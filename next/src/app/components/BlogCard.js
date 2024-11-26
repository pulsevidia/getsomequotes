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
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { DM_Sans, Afacad_Flux } from "next/font/google";

// Fonts optimized for used weights
const dm_sans = DM_Sans({
  weight: ["400", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const afacad_flux = Afacad_Flux({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

// Static image array inside the file
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
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const isSmallScreen = useMediaQuery("(max-width: 480px)");

  // Random image state, computed once on mount
  const [randomImage, setRandomImage] = useState("");

  useEffect(() => {
    setRandomImage(allImage[Math.floor(Math.random() * allImage.length)]);
  }, []);

  // Extract title logic
  const title = useMemo(() => {
    const start = blog.blog_markdown.indexOf("##");
    if (start === -1) return null;
    const end = blog.blog_markdown.indexOf("\n", start);
    return blog.blog_markdown.slice(start + 2, end).trim();
  }, [blog.blog_markdown]);

  // Parse markdown content
  const content = useMemo(() => removeMarkdown(blog.blog_markdown), [blog.blog_markdown]);

  // Pre-memoize styles
  const cardBackground = colorScheme === "dark" ? "rgb(19, 27, 46)" : theme.colors.gray[0];
  const textColor = colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[9];

  return (
    <Link href={`/blog/${blog.$id}`} style={{ textDecoration: "none" }}>
      <Card
        shadow={cardShadows.md}
        maw={600}
        style={{ cursor: "pointer" }}
        mx="xs"
        radius="sm"
        padding={0}
        bg={cardBackground}
      >
        <Group gap="xs" align="flex-start" wrap="nowrap">
          <BackgroundImage
            style={{ boxShadow: cardShadows.xs }}
            loading="lazy"
            miw={isSmallScreen ? 120 : 140}
            mih={isSmallScreen ? 167 : 150}
            padding={40}
            src={blog?.blog_image || `/images_4_blogs/${randomImage}`}
          />

          <Stack pr="sm" py="sm" gap={0}>
            <Group mb="xs" gap="xs" align="flex-start">
              <Badge
                variant="light"
                className={afacad_flux.className}
                size={isSmallScreen ? "xs" : "sm"}
                color={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[6]}
                style={{ boxShadow: cardShadows.xs }}
              >
                {blog?.books?.book_name || "Unknown"}
              </Badge>
              <Text
                miw={200}
                size="xs"
                weight={600}
                color={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[6]}
                className={dm_sans.className}
              >
                {blog.books?.author || "Unknown"}
              </Text>
            </Group>
            <Title
              lineClamp={2}
              weight={600}
              className={dm_sans.className}
              size={isSmallScreen ? "18px" : "20px"}
              style={{ lineHeight: 1.1 }}
              mb="xs"
              color={textColor}
            >
              {title}
            </Title>
            <Text
              color={colorScheme === "dark" ? "rgb(182, 141, 133)" : theme.colors.gray[5]}
              weight={500}
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
