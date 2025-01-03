import { Query } from "appwrite";
import { databases } from "./appwrite";
import removeMarkdown from "markdown-to-text";
import { extractFirstLine } from "@/app/helpers/helper";
import { markBlogRead } from "./update/updateBlog";
//hello
async function getBlogById(id, user_id) {
  try {
    const doc = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_BLOGS_COLLECTION_ID,
      id,
      [Query.select(["user_id"])]
    );

    if (doc.user_id !== '66dbf6d30kewiw04e3ii4' && doc.user_id !== user_id) {
      throw Error("The Blog Does not you belongs to you");
    }

    const blog = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_BLOGS_COLLECTION_ID,
      id
    );
    return { blog, isANoContentBlog: doc.user_id === '66dbf6d30kewiw04e3ii4' };
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
}

async function getAllBlogsWithBookId({ book_id, blog_exception, isANoContentBlog }) {
  try {
    if (isANoContentBlog) {
      const blogs = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_BLOGS_COLLECTION_ID,
        [Query.equal("books", [book_id]), Query.notEqual("$id", [blog_exception]),]
      );
      return blogs
    } else {
      const blogs = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_BLOGS_COLLECTION_ID,
        [Query.equal("books", [book_id]), Query.notEqual("$id", [blog_exception]), Query.isNull("isRead")]
      );
      return blogs;
    }

  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getBlogAndSuggestedBlogs(id, user_id) {
  try {
    const { blog: blogData, isANoContentBlog } = await getBlogById(id, user_id);

    if (!blogData.isRead) {
      await markBlogRead({ id: blogData.$id });
    }

    const bookId = blogData.books.$id;
    const { documents } = await getAllBlogsWithBookId({ book_id: bookId, blog_exception: id, isANoContentBlog });

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