import { ID } from "appwrite"
import { databaseID, databases, tokenisationCollectionID } from "../appwrite"

async function createTokenEntry({ token_name, user_id, access }) {
    try {
        const jsonString = JSON.stringify(access)
        const token = crypto.randomUUID();

        const response = await databases.createDocument(databaseID, tokenisationCollectionID, ID.unique(), {
            user_id,
            access: jsonString,
            token,
            token_name
        });

        const accessJSON = JSON.parse(response.access)
        const accessArray = Object.entries(accessJSON).flatMap(([category, actions]) => Object.entries(actions).map(([key, value]) => ({ category, access_type: key, value })))

        return { ...response, access: accessArray }

    } catch (error) {
        console.error(error)
        throw error
    }
}
export { createTokenEntry }