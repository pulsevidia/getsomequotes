import {
  Card,
  Text,
  Badge,
  Group,
  Box,
  BackgroundImage,
  Stack,
  Title,
  useMantineTheme,
} from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";
import removeMarkdown from "markdown-to-text";
import { useNavigate } from "react-router-dom";
import { cardShadows } from "../utils/shadows";

function BlogCard({ blog }) {
  function extractFirstLine(blog) {
    const start = blog.blog_markdown.indexOf("##");
    if (start === -1) return null;

    const end = blog.blog_markdown.indexOf("\n", start);
    if (end === -1) return null;

    const what = [blog.blog_markdown.slice(start + 2, end).trim()];
    return what;
  }

  const title = extractFirstLine(blog);
  const content = removeMarkdown(blog.blog_markdown);
  const smallSizeMath = useMediaQuery("(max-width:480px)");

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

  const randomImage = allImage[Math.floor(Math.random() * allImage.length)];

  const navigate = useNavigate();
  const theme = useMantineTheme();

  return (
    <Card
      shadow={cardShadows.md}
      maw={600}
      // mih={150}
      style={{ cursor: "pointer" }}
      mx={"xs"}
      radius={"sm"}
      styles={{ root: { padding: 0 } }}
      onClick={() => navigate(`/blog/${blog.$id}`)}
    >
      <Group
      gap={'xs'}
        // gap={smallSizeMath && "32"}
        style={{ flexWrap: "nowrap", alignItems: "flex-start" }}
      >
        <BackgroundImage
          style={{
            boxShadow: cardShadows.xs,
          }}
          miw={smallSizeMath ? 120 : 140}
          mih={smallSizeMath ? 167 : 150}
          p={40}
          src={`/images_4_blogs/${randomImage}`}
          // radius="md"
        ></BackgroundImage>

        <Stack pr={"sm"} py={"sm"} gap={0}>
          <Group
            style={{ flexDirection: smallSizeMath && "column" }}
            mb={"xs"}
            gap={"xs"}
            align="flex-start"
          >
            <Badge
              variant="light"
              color={"gray"}
              style={{
                boxShadow: cardShadows.xs,
                fontFamily: "Afacad Flux",
              }}
              size={smallSizeMath ? "xs" : "sm"}
            >
              {blog?.books?.book_name}
            </Badge>
            <Text
              size="xs"
              fw={600}
              c={"gray"}
              style={{ fontFamily: "Cirular medium" }}
            >
              {blog.books?.author || "Unknown"}
            </Text>
          </Group>
          <Title
            lineClamp={2}
            c={"dark"}
            fw={smallSizeMath ? 600 : 600}
            style={{
              fontFamily: "DM Sans, sans-serif",
              lineHeight: 1.1,
            }}
            mb={"xs"}
            size={smallSizeMath ? "18px" : "20px"}
            // order={smallSizeMath ? "18px" : 3}
          >
            {title}
          </Title>
          <Text
            c={theme.colors.gray[6]}
            fw={900}
            lineClamp={2}
            size="sm"
            style={{ fontFamily: "Cirular medium" }}
          >
            {content}
          </Text>
        </Stack>
        {/* <BackgroundImage
          style={{
            boxShadow: cardShadows.xs,
          }}
          miw={smallSizeMath ? 100 : 140}
          mih={smallSizeMath ? 210 : 159}
          p={40}
          src={`/images_4_blogs/${randomImage}`}
          // radius="md"
        ></BackgroundImage> */}
      </Group>
    </Card>
  );
}
export default BlogCard;
