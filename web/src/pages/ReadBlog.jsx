import {
  Center,
  Loader,
  Title,
  Text,
  Image,
  Badge,
  Stack,
  Code,
  useMantineTheme,
  useComputedColorScheme,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getBlogById } from "../appwrite/getBlogById";
import { useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import { Quotes } from "@phosphor-icons/react";
import QuoteCard from "../components/QuoteCard";
import { useColorScheme } from "@mantine/hooks";

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

function ReadBlog() {
  const colorScheme = useComputedColorScheme();
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
  });
  const randomImage = allImage[Math.floor(Math.random() * allImage.length)];

  const theme = useMantineTheme();

  const icon = <Quotes size={30} />;
  // Custom components
  const Title1 = ({ children }) => (
    <Title
      c={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[9]}
      style={{ fontFamily: "Spectral, serif" }}
      fw={500}
      order={1}
      my={"md"}
    >
      {children}
    </Title>
  );

  const Title2 = ({ children }) => (
    <Title
      c={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[9]}
      style={{ fontFamily: "Speactral, serif" }}
      fw={500}
      order={1}
      my={"md"}
    >
      {children}
    </Title>
  );

  const Title3 = ({ children }) => (
    <Title
      style={{ fontFamily: "Spectral, serif" }}
      c={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[9]}
      order={3}
      my={"md"}
    >
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
      c={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[9]}
      size="lg"
      style={{ fontFamily: "Spectral, serif" }}
    >
      {children}
    </Text>
  );

  const forEm = ({ children }) => (
    <Text
      c={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[9]}
      size="lg"
      style={{ fontFamily: "Cirular medium" }}
      fs={"italic"}
    >
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
    <Stack miw={300} gap={"xs"} align="start" maw={800} px={"md"} mx={"auto"}>
      <Badge
        color={colorScheme === "dark" ? "#febeb5" : theme.colors.gray[6]}
        variant="light"
        size="lg"
        style={{ fontFamily: "Afacad Flux" }}
      >
        {data.books.book_name}
      </Badge>

      <Text
        c={colorScheme === "dark" ? "#febeb5" : theme.colors.gray[6]}
        ta={"right"}
        size="md"
        style={{ fontFamily: "Afacad Flux" }}
      >
        —{data.books?.author || "Unknown"}
      </Text>

      <MarkdownToCustom markdown={data.blog_markdown} />
    </Stack>
  );
}

export default ReadBlog;
