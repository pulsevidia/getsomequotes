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
  useMantineTheme,
  Avatar,
  Group,
  ScrollArea,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getBlogAndSuggestedBlogs } from "../appwrite/getBlogById";
import { Link, useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import QuoteCard from "../components/QuoteCard";
import { useMediaQuery } from "@mantine/hooks";
import { cardShadows } from "../utils/shadows";

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

// Custom components
const Title1 = ({ children }) => (
  <Title style={{ fontFamily: "Spectral, serif" }} fw={500} order={3} my={"md"}>
    {children}
  </Title>
);

const Title2 = ({ children }) => (
  <Title style={{ fontFamily: "DM sans" }} fw={500} order={2} my={"md"}>
    {children}
  </Title>
);

const Title3 = ({ children }) => (
  <Title style={{ fontFamily: "Spectral, serif" }} order={3} my={"md"}>
    {children}
  </Title>
);

const CodeBlock = ({ children }) => {
  <Code block>{children}</Code>;
};

const TextMarkdown = ({ children }) => (
  <Text
    py={"xs"}
    ta={"left"}
    size="xl"
    style={{ fontFamily: "Spectral, serif" }}
  >
    {children}
  </Text>
);

const forEm = ({ children }) => (
  <Text style={{ fontFamily: "Cirular medium" }} fs={"italic"}>
    {children}
  </Text>
);

const ForBlockquote = ({ children }) => <QuoteCard quote={children} />;

const MarkdownToCustom = ({ markdown }) => {
  return (
    <Markdown
      options={{
        overrides: {
          code: { component: CodeBlock },
          h1: { component: Title1 },
          h2: { component: Title2 },
          h3: { component: Title3 },
          p: { component: TextMarkdown },
          em: { component: forEm },
          blockquote: { component: ForBlockquote },
        },
      }}
    >
      {markdown}
    </Markdown>
  );
};

function ReadBlog() {
  const theme = useMantineTheme();
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogAndSuggestedBlogs(id),
  });

  const smallSizeMath = useMediaQuery("(max-width:480px)");

  const randomImage = allImage[Math.floor(Math.random() * allImage.length)];

  if (isLoading) {
    return (
      <Center h="100%">
        <Loader type="dots" />
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
  return (
    <Stack miw={300} gap={0} align="start" maw={800} px={"md"} mx={"auto"}>
      <Image
        w={"100%"}
        miw={300}
        maw={800}
        style={{ boxShadow: cardShadows.xs }}
        src={`/images_4_blogs/${randomImage}`}
        radius={"md"}
        mih={300}
        mah={300}
      />
      <Badge
        color="gray"
        mt={"md"}
        size="lg"
        style={{ fontFamily: "Afacad Flux", boxShadow: cardShadows.xs }}
      >
        {data.blogData.books.book_name}
      </Badge>

      <Text ta={"right"} size="md" style={{ fontFamily: "Afacad Flux" }}>
        —{data.blogData.books?.author || "Unknown"}
      </Text>

      <MarkdownToCustom markdown={data.blogData.blog_markdown} />
      <Text
        mt={"lg"}
        c={"gray"}
        style={{ fontFamily: "Afacad Flux", textTransform: "uppercase" }}
      >
        more from
      </Text>
      <Title
        fw={500}
        c={"dark"}
        order={4}
        style={{ fontFamily: "Afacad Flux", textTransform: "uppercase" }}
      >
        {data.blogData.books.book_name}
      </Title>
      <ScrollArea w={smallSizeMath ? 350 : 800} h={200}>
        <Group style={{ overflow: "hidden" }} gap={'xs'} mt={"xs"} wrap="nowrap">
          {data.allBlogsWithBookId.map((blog) => (
            <Link style={{ textDecoration: "none" }} to={`/blog/${blog.$id}`}>
              <Card
                shadow={cardShadows.xs}
                miw={300}
                mih={137}
                maw={300}
                p={"md"}
                radius={"lg"}
                bg={theme.colors.gray[2]}
              >
                <Title
                  lineClamp={2}
                  mih={43}
                  fw={500}
                  order={4}
                  c={"dark"}
                  style={{ lineHeight: 1.2, fontFamily: "Afacad Flux" }}
                >
                  {blog?.blogTitle ||
                    "Suprise Blog It Has No Title, So Why Not Try This One "}
                </Title>
                <Text
                  c={"gray"}
                  mt={5}
                  size="sm"
                  lineClamp={2}
                  style={{ lineHeight: 1.1, fontFamily: "DM sans" }}
                >
                  {blog.blogContent}
                </Text>
                <Group
                  style={{ overflowX: "scroll" }}
                  gap={3}
                  align="center"
                  mt={"xs"}
                >
                  <Avatar
                    size={"xs"}
                    src={data.blogData.books.book_image}
                    alt="it's me"
                  />
                  <Text c={"dark"} size="xs">
                    {data.blogData.books.author}
                  </Text>
                </Group>
              </Card>
            </Link>
          ))}
        </Group>
      </ScrollArea>
    </Stack>
  );
}

export default ReadBlog;
