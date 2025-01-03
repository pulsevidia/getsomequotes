import { Query } from "appwrite"
import { databaseID, databases, tokenisationCollectionID } from "../appwrite"

async function getTokenData({ user_id }) {
    try {
        const { documents } = await databases.listDocuments(databaseID, tokenisationCollectionID, [Query.equal('user_id', [user_id])])

        const mappedDocuments = documents.map(doc => {
            const parsedJSON = JSON.parse(doc.access);

            const accessArray = Object.entries(parsedJSON).flatMap(([category, permissions]) =>
                Object.entries(permissions).map(([access_type, permissionKey]) => ({ category, access_type, value: permissionKey }))
            )
            return { ...doc, access:accessArray }
        })
console.log(mappedDocuments)
        return mappedDocuments;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export { getTokenData }