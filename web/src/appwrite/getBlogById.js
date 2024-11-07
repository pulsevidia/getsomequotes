import { Query } from "appwrite";
import { databases } from "./appwrite";
import removeMarkdown from "markdown-to-text";
import { extractFirstLine } from "../helpers/helper";

async function getBlogById(id) {
  try {
    const blog = await databases.getDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_BLOGS_COLLECTION_ID,
      id
    );
    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
}

async function getAllBlogsWithBookId(id) {
  try {
    const blogs = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_BLOGS_COLLECTION_ID,
      [Query.equal("books", [id])]
    );
    return blogs;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getBlogAndSuggestedBlogs(id) {
  try {
    const blogData = await getBlogById(id);
    const bookId = blogData.books.$id;
    const { documents } = await getAllBlogsWithBookId(bookId);

    const allBlogsWithBookId = documents.map((blog) => {
      const markdown = blog.blog_markdown;
      const blogContent = removeMarkdown(markdown);
      const blogTitle = extractFirstLine(markdown);
      return { ...blog, blogContent, blogTitle };
    });

    return { blogData, allBlogsWithBookId };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { getBlogById, getAllBlogsWithBookId, getBlogAndSuggestedBlogs };
