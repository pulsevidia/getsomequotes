"use client";
import {
  Center,
  Loader,
  Title,
  Text,
  Image,
  Badge,
  Stack,
  Code,
  Card,
  Avatar,
  Group,
  ScrollArea,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getBlogAndSuggestedBlogs } from "../../../appwrite/getBlogById";
import Link from "next/link";
import { useParams } from "next/navigation";
import Markdown from "markdown-to-jsx";
import QuoteCard from "../../components/QuoteCard";
import { useMediaQuery } from "@mantine/hooks";
import { cardShadows } from "../../utils/shadows";

// List of images
const allImages = Array.from({ length: 24 }, (_, i) => `${i + 1}${i >= 12 ? ".webp" : ".jpg"}`);

// Custom components
const TitleComponent = ({ children, order = 1, style = {} }) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const color = colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[9];
  return (
    <Title c={color} style={{ fontFamily: "Spectral, serif", ...style }} fw={500} order={order}>
      {children}
    </Title>
  );
};

const TextMarkdown = ({ children }) => (
  <Text py="xs" ta="left" size="xl" style={{ fontFamily: "Spectral, serif" }}>
    {children}
  </Text>
);

const CodeBlock = ({ children }) => <Code block>{children}</Code>;
const EmphasizedText = ({ children }) => (
  <Text fs="italic" style={{ fontFamily: "Circular medium" }}>
    {children}
  </Text>
);
const BlockquoteText = ({ children }) => <QuoteCard quote={children} />;

const MarkdownToCustom = ({ markdown }) => (
  <Markdown
    options={{
      overrides: {
        code: { component: CodeBlock },
        h1: { component: (props) => <TitleComponent {...props} order={1} /> },
        h2: { component: (props) => <TitleComponent {...props} order={1} /> },
        h3: { component: (props) => <TitleComponent {...props} order={3} /> },
        p: { component: TextMarkdown },
        em: { component: EmphasizedText },
        blockquote: { component: BlockquoteText },
      },
    }}
  >
    {markdown}
  </Markdown>
);

const BlogCard = ({ blog, colorScheme, theme, bookImage, author }) => (
  <Link href={`/blog/${blog.$id}`} style={{ textDecoration: "none" }}>
    <Card
      shadow={cardShadows.xs}
      bg={colorScheme === "dark" ? "rgb(19, 27, 46)" : theme.colors.gray[2]}
      miw={300}
      mih={137}
      p="md"
      radius="lg"
    >
      <Title
        lineClamp={2}
        mih={43}
        fw={500}
        order={4}
        c={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[9]}
        style={{ lineHeight: 1.2, fontFamily: "Afacad Flux" }}
      >
        {blog.blogTitle || "Surprise Blog It Has No Title"}
      </Title>
      <Text
        c={colorScheme === "dark" ? "rgba(182, 141, 133, 0.46)" : theme.colors.gray[6]}
        fw={500}
        mt={5}
        size="sm"
        lineClamp={2}
        style={{ lineHeight: 1.1, fontFamily: "DM sans" }}
      >
        {blog.blogContent}
      </Text>
      <Group gap={4} align="center" mt="xs">
        <Avatar size="xs" src={bookImage} alt="Author" />
        <Text c={colorScheme === "dark" ? "rgb(182, 141, 133)" : theme.colors.gray[6]} size="sm">
          {author}
        </Text>
      </Group>
    </Card>
  </Link>
);

function ReadBlog() {
  const theme = useMantineTheme();
  const { id } = useParams();

  const colorScheme = useComputedColorScheme();
  const smallScreen = useMediaQuery("(max-width:480px)");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogAndSuggestedBlogs(id),
  });

  const randomImage = allImages[Math.floor(Math.random() * allImages.length)];

  if (isLoading) {
    return (
      <Center h="100%">
        <Loader color={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[9]} type="dots" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center h="100%">
        <Text>Error occurred while fetching the blog.</Text>
      </Center>
    );
  }

  const { blogData, allBlogsWithBookId } = data;

  return (
    <Stack miw={300} align="start" maw={800} px="md" mx="auto" gap="lg">
      {/* Blog Image */}
      <Image
        w="100%"
        miw={300}
        maw={800}
        src={`/images_4_blogs/${randomImage}`}
        style={{ boxShadow: cardShadows.xs }}
        radius="md"
        mih={300}
        mah={300}
      />

      <Stack gap={0}>
        {/* Book Badge */}
        <Badge
          color={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[6]}
          mt="md"
          variant="light"
          size="lg"
          style={{ fontFamily: "Afacad Flux", boxShadow: cardShadows.xs }}
        >
          {blogData.books.book_name}
        </Badge>

        {/* Author Name */}
        <Text
          c={colorScheme === "dark" ? "#febeb5" : theme.colors.gray[6]}
          ta="left"
          size="md"
          style={{ fontFamily: "Afacad Flux" }}
        >
          —{blogData.books?.author || "Unknown"}
        </Text>
      </Stack>

      {/* Blog Content */}
      <MarkdownToCustom markdown={blogData.blog_markdown} />

      {/* Related Blogs */}
      <Stack gap={0}>
        <Text mt="lg" c="gray" style={{ fontFamily: "Afacad Flux", textTransform: "uppercase" }}>
          more from
        </Text>
        <TitleComponent order={4} style={{ textTransform: "uppercase" }}>
          {blogData.books.book_name}
        </TitleComponent>
      </Stack>
      <ScrollArea w={smallScreen ? 340 : 800} h={200}>
        <Group gap="xs" mt="xs" wrap="nowrap">
          {allBlogsWithBookId.map((blog) => (
            <BlogCard
              key={blog.$id}
              blog={blog}
              colorScheme={colorScheme}
              theme={theme}
              bookImage={blogData.books.book_image}
              author={blogData.books.author}
            />
          ))}
        </Group>
      </ScrollArea>
    </Stack>
  );
}

export default ReadBlog;
