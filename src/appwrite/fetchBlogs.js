import { Query } from "appwrite";
import { databases } from "./appwrite";
import { getBlogById } from "./getBlogById";

async function fetchBlogsWithIdArray({ idsArray, user_id }) {
  try {
    const blogs = [];
    for (const id of idsArray) {
      const result = await getBlogById(id, user_id);
      blogs.push(result);
    }
    const reversedBlogs = blogs.reverse();
    return reversedBlogs;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchBlogs(user_id, offset = 0) {
  try {
    const { documents } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_BLOGS_COLLECTION_ID,
      [Query.limit(7), Query.offset(offset * 7), Query.orderDesc(), Query.equal("user_id", [user_id]), Query.isNull("isRead")]
    );

    return documents
  } catch (error) {
    console.error(error);
  }
}
export { fetchBlogsWithIdArray, fetchBlogs };
