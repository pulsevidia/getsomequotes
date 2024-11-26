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
    return blogs;
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
      [Query.limit(2000), Query.equal("user_id", [id])]
    );
    const refined_documents = [];

    documents.forEach((doc) => {
      doc.books ? refined_documents.push(doc) : null;
    });

    return refined_documents.reverse();
  } catch (error) {
    console.error(error);
  }
}
export { fetchBlogsWithIdArray, fetchBlogs };
