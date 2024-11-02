import { Query } from "appwrite";
import { databases } from "./appwrite";

export async function fetchBlogs(id) {
  try {
    const { documents } = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_BLOGS_COLLECTION_ID,
      [Query.limit(2000), Query.equal("user_id", [id])]
    );
    console.log(documents);
    const refined_documents = [];
    documents.forEach((doc) => {
      doc.books ? refined_documents.push(doc) : null;
    });

    return refined_documents;
  } catch (error) {
    console.error(error);
  }
}
