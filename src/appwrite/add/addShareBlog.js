const { databases, databaseID, publiclySharedBlogsCollectionId } = require("../appwrite");

async function shareBlogPublicly({
  user_id,
  user_name,
  blog_markdown,
  author_name,
  book_name,
  book_image,
  user_avatar,
  document_id,
  blog_image,
}) {
  try {
    const response = await databases.createDocument(databaseID, publiclySharedBlogsCollectionId, document_id, {
      user_id,
      user_name,
      blog_markdown,
      author_name,
      book_image,
      book_name,
      user_avatar,
      blog_image,
    });

    return response.$id;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export { shareBlogPublicly };
