export async function generateContent(bookId) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_NODE_SERVER_URL}generate-content?id=${bookId}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("No chunks found for this book.");
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    }

    const data = await response.json();
    console.log("Data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching content:", error.message);
    throw error; // Optionally rethrow the error if it needs to be handled further up
  }
}
