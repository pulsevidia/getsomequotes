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
import Image from "next/image";
import { dark_theme } from "../config/theme";

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

function BlogCard({ blog }) {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const isSmallScreen = useMediaQuery("(max-width: 480px)");

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
  const cardBackground = colorScheme === "dark" ? dark_theme.nav_link_dark_color : theme.colors.gray[0];
  const textColor = colorScheme === "dark" ? dark_theme.main_text_color : theme.colors.gray[9];

  return (
    <Link href={`/blog/${blog.$id}`} style={{ textDecoration: "none" }}>
      <Card
        shadow={cardShadows.md}
        maw={600}
        style={{ cursor: "pointer" }}
        mx="xs"
        radius="md"
        padding={0}
        bg={cardBackground}
      >
        <Group gap="xs" align="flex-start" wrap="nowrap">
          <Image
            alt="Mountains"
            src={blog.blog_image || `/images_4_blogs/1.jpg`}
            quality={100}
            style={{
              boxShadow: cardShadows.xs,
              minWidth: isSmallScreen ? 120 : 140,
              maxHeight: isSmallScreen ? 167 : 150,
              objectFit: "cover",
            }}
            width={isSmallScreen ? 120 : 140}
            height={isSmallScreen ? 167 : 150}
            loading="lazy"
            sizes="100vw"
          />
          {/* <BackgroundImage
            loading="lazy"
            miw={isSmallScreen ? 120 : 140}
            mih={isSmallScreen ? 167 : 150}
            padding={40}
            src={blog?.blog_image || `/images_4_blogs/${randomImage}`}
          />
 */}
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
              c={textColor}
            >
              {title}
            </Title>
            <Text
              c={colorScheme === "dark" ? "rgb(182, 141, 133)" : theme.colors.gray[5]}
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
