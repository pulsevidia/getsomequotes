import {
  Center,
  Loader,
  Title,
  Text,
  Image,
  Badge,
  Stack,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getBlogById } from "../appwrite/getBlogById";
import { useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import { Quotes } from "@phosphor-icons/react";

const icon = <Quotes size={30} />;
// Custom components
const Title1 = ({ children }) => (
  <Title style={{ fontFamily: "Afacad Flux" }} fw={500} order={1} my={"md"}>
    {children}
  </Title>
);

const Title2 = ({ children }) => (
  <Title style={{ fontFamily: "Afacad Flux" }} fw={500} order={1} my={"md"}>
    {children}
  </Title>
);

const Title3 = ({ children }) => (
  <Title style={{ fontFamily: "Circular" }} order={3} my={"md"}>
    {children}
  </Title>
);

const TextMarkdown = ({ children }) => (
  <Text
    py={"xs"}
    ta={"justify"}
    size="lg"
    style={{ fontFamily: "Cirular medium" }}
  >
    {children}
  </Text>
);

const forEm = ({ children }) => (
  <Text style={{ fontFamily: "Cirular medium" }} fs={"italic"}>
    {children}
  </Text>
);

const MarkdownToCustom = ({ markdown }) => {
  return (
    <Markdown
      options={{
        overrides: {
          h1: { component: Title1 },
          h2: { component: Title2 },
          h3: { component: Title3 },
          p: { component: TextMarkdown },
          em: { component: forEm },
        },
      }}
    >
      {markdown}
    </Markdown>
  );
};

function ReadBlog() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
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
    <Stack miw={300} gap={"xs"} align="start" maw={600} px={"md"} mx={"auto"}>
      <Image
        w={"100%"}
        miw={300}
        maw={600}
        src={`/images_4_blogs/${randomImage}`}
        radius={"md"}
        mih={300}
        mah={600}
      />
      <Badge color="gray" size="lg" style={{ fontFamily: "Afacad Flux" }}>
        {data.books.book_name}
      </Badge>

      <Text ta={"right"} size="md" style={{ fontFamily: "Afacad Flux" }}>
        —{data.books?.author || "Unknown"}
      </Text>

      <MarkdownToCustom markdown={data.blog_markdown} />
    </Stack>
  );
}

export default ReadBlog;
