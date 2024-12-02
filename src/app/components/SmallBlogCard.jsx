import Link from "next/link";
import { Avatar, Card, Group, Text, Title, useComputedColorScheme, useMantineTheme } from "@mantine/core";
import { cardShadows } from "../utils/shadows";
import { Afacad_Flux, DM_Sans } from "next/font/google";

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

function SmallBlogCard({ blog, bookImage, author }) {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();

  return (
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
        <Group gap={4} align="center" mt="xs">
          <Avatar size="xs" src={bookImage} alt="Author" />
          <Text c={colorScheme === "dark" ? "rgb(182, 141, 133)" : theme.colors.gray[6]} size="sm">
            {author}
          </Text>
        </Group>
      </Card>
    </Link>
  );
}
export default SmallBlogCard;
