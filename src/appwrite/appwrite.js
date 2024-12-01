import { Client, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_PROJECT_URL) // Your Endpoint
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID); // Your project ID

export const databases = new Databases(client);
export const storage = new Storage(client);
export const databaseID = process.env.NEXT_PUBLIC_DATABASE_ID;
