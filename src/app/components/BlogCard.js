import {
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Title,
  useMantineTheme,
  useComputedColorScheme,
  Button,
  Modal,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import removeMarkdown from "markdown-to-text";
import { cardShadows } from "../utils/shadows";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { dark_theme } from "../config/theme";
import { afacad_flux, dm_sans } from "../font";
import { CheckCircle, Share } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { shareBlogPublicly } from "@/appwrite/add/addShareBlog";
import { useUser } from "@clerk/clerk-react";
import { ID } from "appwrite";
import CopyButton from "./CopyButton";

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

  const [opened, { open, close }] = useDisclosure(false);
  // status can be idle, pending, success, error
  const {
    mutateAsync: shareBlog,
    status,
    data,
  } = useMutation({
    mutationFn: shareBlogPublicly,
    onError: () => {
      toast.error("Something went wrong", {
        style: {
          backgroundColor: colorScheme === "dark" ? dark_theme.card_bg_dark_color : "black",
          color: "white",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["shareblog"] });
    },
  });

  const {
    user: { id, imageUrl, fullName },
  } = useUser();
  const document_id = ID.unique();
  return (
    <>
      <Button onClick={open}>Share Blog</Button>
      <Modal
        radius={"xl"}
        centered
        styles={{
          content: {
            maxWidth: "310px",
          },
          body: {
            background: colorScheme === "dark" ? dark_theme.app_bg_dark_color : "white",
            paddingTop: "1rem",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            paddingBottom: "1rem",
          },
          header: {
            display: "none",
          },
        }}
        opened={opened}
        onClose={status !== "pending" && close}
        title="upload"
      >
        <Title
          lineClamp={3}
          ta={"center"}
          mb={"sm"}
          weight={600}
          className={afacad_flux.className}
          order={3}
          style={{ lineHeight: 1.1 }}
          c={textColor}
        >
          Share Blog Publicly
        </Title>

        <Card
          shadow={cardShadows.md}
          maw={270}
          style={{ cursor: "pointer" }}
          mx="xs"
          radius="md"
          bg={cardBackground}
          p={"xs"}
        >
          <Group wrap="nowrap" justify="space-between" align="flex-start">
            <Image
              alt="Mountains"
              src={blog.blog_image || `/images_4_blogs/1.jpg`}
              quality={100}
              style={{
                boxShadow: cardShadows.xs,
                objectFit: "cover",
                borderRadius: "10px",
              }}
              width={50}
              height={50}
              loading="lazy"
              sizes="100vw"
            />
            <Stack gap={"0"}>
              <Title
                maw={190}
                lineClamp={3}
                weight={600}
                className={dm_sans.className}
                size={"sm"}
                style={{ lineHeight: 1.1 }}
                c={textColor}
              >
                {title}
              </Title>
              <Group gap={"xs"} wrap="nowrap" mt={"5"}>
                <Badge
                  variant="light"
                  className={afacad_flux.className}
                  size={"xs"}
                  w={80}
                  color={colorScheme === "dark" ? "#f2beb5" : theme.colors.gray[6]}
                  style={{ boxShadow: cardShadows.xs }}
                >
                  {blog?.books?.book_name || "Unknown"}
                </Badge>
                <Text
                  ml={4}
                  size="xs"
                  w={80}
                  truncate
                  weight={600}
                  color={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[6]}
                  className={dm_sans.className}
                >
                  {blog.books?.author || "Unknown"}
                </Text>
              </Group>
            </Stack>
          </Group>
        </Card>
        <Text
          ml={"xs"}
          mt={"xs"}
          size="xs"
          fw={500}
          color={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[6]}
          className={dm_sans.className}
        >
          {status !== "success"
            ? "Note: Sharing this will make your blog pulicly accessible to everyone with the generated link."
            : "Content shared successfully!"}
        </Text>
        <Group justify="center" ml={"xs"} mt={"xs"} gap={"xs"} display={status === "success" ? "" : "none"}>
          <CopyButton
            text={"Copy Link"}
            value={`https://purplenight.hyperingenious.tech/shared/blogs/public/${data}`}
          />
        </Group>
        <Button
          display={status === "success" && "none"}
          w={270}
          mt={"sm"}
          mx={"xs"}
          leftSection={<Share size={16} />}
          color={colorScheme === "dark" ? dark_theme.secondary_text_color : theme.colors.gray[2]}
          c={colorScheme === "dark" ? dark_theme.nav_link_dark_color : theme.colors.dark[9]}
          radius={"md"}
          fullWidth
          loading={status === "pending"}
          loaderProps={{ type: "dots" }}
          style={{
            boxShadow: `${cardShadows.md}`,
          }}
          onClick={async () =>
            await shareBlog({
              user_id: id,
              user_name: fullName,
              user_avatar: imageUrl,
              blog_markdown: blog.blog_markdown,
              author_name: blog.books.author,
              book_name: blog.books.book_name,
              book_image: blog.books.book_image,
              document_id,
            })
          }
        >
          Share Blog
        </Button>
      </Modal>

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
                minWidth: isSmallScreen ? 120 : 140,
                maxHeight: 170,
                boxShadow: cardShadows.xs,
                objectFit: "cover",
              }}
              width={isSmallScreen ? 120 : 140}
              height={170}
              loading="lazy"
              sizes="100vw"
            />
            <Stack pr="sm" py="sm" gap={0}>
              <Group mb="xs" gap="xs" style={{ flexDirection: "column" }} align="flex-start">
                <Group gap={"xs"}>
                  <Badge
                    variant="light"
                    className={afacad_flux.className}
                    size={isSmallScreen ? "xs" : "sm"}
                    color={colorScheme === "dark" ? "#f2beb5" : theme.colors.gray[6]}
                    style={{ boxShadow: cardShadows.xs }}
                  >
                    {blog?.books?.book_name || "Unknown"}
                  </Badge>
                  <Badge
                    variant="light"
                    className={afacad_flux.className}
                    size={isSmallScreen ? "xs" : "sm"}
                    styles={{ label: { display: "flex", alignItems: "center", gap: "0.2rem" } }}
                    color={blog.isRead ? "green" : "red"}
                    style={{ boxShadow: cardShadows.xs }}
                  >
                    <CheckCircle size={12} />
                    {blog.isRead ? "READ" : "UNREAD"}
                  </Badge>
                </Group>
                <Text
                  miw={200}
                  ml={4}
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
    </>
  );
}

export default BlogCard;
