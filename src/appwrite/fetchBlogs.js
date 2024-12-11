import { Query } from "appwrite";
import { databases } from "./appwrite";
import { getBlogById } from "./getBlogById";
import { shuffleArrayRandomly } from "@/app/helpers/helper";

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

async function fetchBlogs(id) {
  try {
    const { documents } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_BLOGS_COLLECTION_ID,
      [Query.limit(2000), Query.equal("user_id", [id]), Query.isNull("isRead")]
    );
    return shuffleArrayRandomly(documents);
  } catch (error) {
    console.error(error);
  }
}
export { fetchBlogsWithIdArray, fetchBlogs };
