import { Query } from "appwrite";
import { databases, storage } from "./appwrite";

function extractFileId(url) {
  const match = url.match(/files\/([^/]+)/);
  return match ? match[1] : null;
}

export async function deleteBookAndDataCompletely(bookId) {
  try {
    // Delete the blogs
    const { documents: blogs } = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_BLOGS_COLLECTION_ID,
      [Query.equal("books", bookId), Query.select(["$id"]), Query.limit(20)]
    );
    if (blogs.length > 0) {
      for (const blog of blogs) {
        await databases.deleteDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_BLOGS_COLLECTION_ID,
          blog.$id
        );
      }
    }

    // Delete the quotes
    const { documents: quotes } = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_QUOTE_COLLECTION_ID,
      [Query.equal("books", bookId), Query.select(["$id"]), Query.limit(20)]
    );

    if (quotes.length > 0) {
      for (const quote of quotes) {
        await databases.deleteDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_QUOTE_COLLECTION_ID,
          quote.$id
        );
      }
    }

    // Get the pdf file link
    const { pdf_link } = await databases.getDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_BOOKS_COLLECTION_ID,
      bookId,
      [Query.select("pdf_link")]
    );

    const pdfId = extractFileId(pdf_link);

    // Delete the pdf file
    await storage.deleteFile(import.meta.env.VITE_BUCKET_ID, pdfId);

    // Delete all chunks for the book
    const { documents: chunks } = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_CHUNKS_COLLECTION_ID,
      [Query.equal("books", bookId), Query.select(["$id"]), Query.limit(170)]
    );

    if (chunks.length > 0) {
      for (const chunk of chunks) {
        await databases.deleteDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_CHUNKS_COLLECTION_ID,
          chunk.$id
        );
      }
    }
    // Delete the book
    await databases.deleteDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_BOOKS_COLLECTION_ID,
      bookId
    );
  } catch (error) {
    throw error;
  }
}
