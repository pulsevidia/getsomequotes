export async function generateContent({ getToken, book_id, user_id }) {
  try {
    const token = await getToken({ template: "supabase_2" })
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}generate-content?id=${book_id}&user_id=${user_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    const res = await response.json();

    if (!response.ok) {
      throw res;
    }

    return null;
  } catch (error) {
    console.error(error.message);
    throw error; // Optionally rethrow the error if it needs to be handled further up
  }
}
