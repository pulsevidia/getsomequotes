import { databases, databaseID, tokenisationCollectionID } from "../appwrite";

async function deleteToken({ document_id }) {
    try {
        const result = await databases.deleteDocument(
            databaseID,
            tokenisationCollectionID,
            document_id
        );
        return result;
    } catch (error) {
        console.error(error)
        throw error
    }
}
export { deleteToken }
