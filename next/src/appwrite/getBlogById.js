import { Query } from "appwrite";
import { databases } from "./appwrite";
import removeMarkdown from "markdown-to-text";
import { extractFirstLine } from "@/app/helpers/helper";

async function getBlogById(id, user_id) {
  try {
    const doc = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_BLOGS_COLLECTION_ID,
      id,
      [Query.select(["user_id"])]
    );
    if (doc.user_id !== user_id) {
      throw Error("The Blog Does not you belongs to you");
    }

    const blog = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_BLOGS_COLLECTION_ID,
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
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_BLOGS_COLLECTION_ID,
      [Query.equal("books", [id])]
    );
    return blogs;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getBlogAndSuggestedBlogs(id, user_id) {
  try {
    const blogData = await getBlogById(id, user_id);
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
