import {
  Card,
  Text,
  Badge,
  Group,
  Box,
  BackgroundImage,
  Stack,
  Title,
} from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";
import removeMarkdown from "markdown-to-text";
import { useNavigate } from "react-router-dom";
function BlogCard({ blog }) {
  function extractFirstLine(inputString) {
    const start = inputString.indexOf('##');
    if (start === -1) return null;
    const end = inputString.indexOf('\n', start);
    if (end === -1) return null;
    return [inputString.slice(start + 2, end).trim(), inputString.slice(end + 1).trim()];
  }

  const title = extractFirstLine(blog.blog_markdown);
  const content = removeMarkdown(blog.blog_markdown);
  const smallSizeMath = useMediaQuery('(max-width:480px)')

  const allImage = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.webp', '14.jpg', '15.jpg', '16.jpg', '17.webp', '18.webp', '19.webp', '20.webp', '21.webp', '22.webp', '23.webp', '24.jpg']

  const randomImage = allImage[Math.floor(Math.random() * allImage.length)];
 const navigate = useNavigate()
  return (
    <Card  maw={600} style={{ cursor: 'pointer' }} padding="lg" radius="md" onClick={() => navigate(`/blog/${blog.$id}`)}>
      <Group style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
        <Box maw={300}>
          <BackgroundImage
            p={40}
            src={`/images_4_blogs/${randomImage}`}
            radius="sm"
          ></BackgroundImage>
        </Box>
        <Stack gap={0}>
          <Badge mb={'xs'} variant="light" color="dark">The Beginning of Infinity</Badge>
          <Title lineClamp={smallSizeMath ? 2 : 1} style={{ fontFamily: "Circular" }} c={"dark"} order={smallSizeMath ? 5 : 3}>{title}</Title>
          {!smallSizeMath &&
            <Text lineClamp={4} style={{ fontFamily: "Cirular medium" }}>
              {content}
            </Text>
          }
        </Stack>
      </Group>
    </Card>
  );
}
export default BlogCard;
