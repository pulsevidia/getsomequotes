import { Query } from "appwrite";
import { databases } from "./appwrite";
/**
 * Fetches data about the book then fetches associated content number and return book
 * @param {string} id
 * @returns {Array}
 */
async function fetchBook(id) {
  try {
    const { documents } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_BOOKS_COLLECTION_ID,
      [Query.equal("user_id", [id])]
    );

    for (let i = 0; i < documents.length; i++) {
      const current_document = documents[i];

      const { documents: blogs } = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_BLOGS_COLLECTION_ID,
        [
          Query.equal("books", current_document.$id),
          Query.equal("user_id", [id]),
          Query.select(["$id"]),
        ]
      );

      documents[i] = { ...current_document, blogs };
    }
    return documents.reverse();
  } catch (e) {
    console.error(e);
  }
}

export { fetchBook };
