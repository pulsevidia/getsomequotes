import Link from "next/link";
import { Badge, Avatar, Card, Group, Text, Title, useComputedColorScheme, useMantineTheme, Stack } from "@mantine/core";
import { cardShadows } from "../utils/shadows";
import { afacad_flux, dm_sans } from "../font";
import { useMediaQuery } from "@mantine/hooks";
import { CheckCircle } from "@phosphor-icons/react";
import Image from "next/image";

function SmallBlogCard({ blog, bookImage, author }) {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const isSmallScreen = useMediaQuery("(max-width: 480px)");

  return (
    <Link href={`/blog/${blog.$id}`} style={{ textDecoration: "none" }}>
      <Card
        shadow={cardShadows.xs}
        bg={colorScheme === "dark" ? "rgb(19, 27, 46)" : theme.colors.gray[2]}
        miw={380}
        p={0}
        mih={137}
        radius="lg"
      >
        <Group wrap="nowrap" gap={"0"}>
          <Image
            alt="Mountains"
            src={blog.blog_image}
            quality={100}
            style={{
              boxShadow: cardShadows.xs,
              objectFit: "cover",
            }}
            width={125}
            height={142}
            sizes="100vw"
          />

          <Stack gap={0} m="md">
            <Title
              lineClamp={2}
              mih={43}
              fw={500}
              order={4}
              c={colorScheme === "dark" ? "#f1beb5" : theme.colors.gray[9]}
              className={afacad_flux.className}
              style={{ lineHeight: 1.2 }}
            >
              {blog.blogTitle || "Surprise Blog It Has No Title"}
            </Title>
            <Text
              c={colorScheme === "dark" ? "rgba(182, 141, 133, 0.46)" : theme.colors.gray[6]}
              fw={500}
              mt={5}
              size="sm"
              lineClamp={2}
              className={dm_sans.className}
              style={{ lineHeight: 1.1 }}
            >
              {blog.blogContent}
            </Text>
            <Group justify="space-between" mt={"xs"} align="center">
              <Group gap={4} align="center">
                <Avatar size="22" src={bookImage} alt="Author" />
                <Text
                  className={afacad_flux.className}
                  c={colorScheme === "dark" ? "rgb(182, 141, 133)" : theme.colors.gray[6]}
                  maw={100}
                  size="sm"
                  truncate
                >
                  {author}
                </Text>
              </Group>
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
          </Stack>
        </Group>
      </Card>
    </Link>
  );
}
export default SmallBlogCard;
