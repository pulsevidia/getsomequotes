import { Query } from "appwrite";
import { databases } from "./appwrite";

export async function fetchBlogs() {
  try {
    const { documents } = await databases.listDocuments(import.meta.env.VITE_DATABASE_ID, import.meta.env.VITE_BLOGS_COLLECTION_ID, [Query.limit(2398)]);
    return documents;
  } catch (error) {
    console.log(error);
  }
}
