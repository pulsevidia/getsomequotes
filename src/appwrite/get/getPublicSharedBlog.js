import { databaseID, databases, publiclySharedBlogsCollectionId } from "../appwrite";

async function getPubliclySharedBlogWithID(id) {
  try {
    const blog = await databases.getDocument(databaseID, publiclySharedBlogsCollectionId, id);

    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
}
export { getPubliclySharedBlogWithID };
