import { Query } from "appwrite";
import { booksCollectionID, databaseID, databases } from "./appwrite";

async function checkIfAtLeastOneBookIsThere({ user_id }) {
  try {
    const { documents } = await databases.listDocuments(databaseID, booksCollectionID, [
      Query.equal("user_id", [user_id]),
      Query.select(["$id"]),
    ]);
    return documents.length;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export { checkIfAtLeastOneBookIsThere };
