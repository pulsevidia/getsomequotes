import { databaseID, databases } from "../appwrite";

async function markBlogRead({ id }) {
  await databases.updateDocument(databaseID, process.env.NEXT_PUBLIC_BLOGS_COLLECTION_ID, id, {
    isRead: true,
  });
  return null;
}
export { markBlogRead };
