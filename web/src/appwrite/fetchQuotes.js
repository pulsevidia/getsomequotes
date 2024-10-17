import { databases } from "./appwrite";

export async function fetchQuotes() {
  const {documents}= await databases.listDocuments(import.meta.env.VITE_DATABASE_ID, import.meta.env.VITE_QUOTE_COLLECTION_ID);
  
  return documents;
}
