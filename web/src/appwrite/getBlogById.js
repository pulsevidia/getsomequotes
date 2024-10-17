import { databases } from "./appwrite";

async function getBlogById(id) {
    try {
        const blog = await databases.getDocument(import.meta.env.VITE_DATABASE_ID, import.meta.env.VITE_BLOGS_COLLECTION_ID, id);
        return blog;
    } catch (error) {
        console.error('Error fetching blog:', error);
        throw error;
    }
}

export { getBlogById }