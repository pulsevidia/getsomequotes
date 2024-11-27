export async function postPDF({ id, file, authorName, bookTitle, currentImage: book_image }) {

  const currentImage = `https://purplenight.hyperingenious.tech/${book_image}`;

  try {
    if (!file || file.length === 0) {
      throw new Error("No file provided.");
    }

    const formData = new FormData();
    formData.append("pdf", file[0]); // Attach the file with the key "pdf"
    formData.append("authorName", authorName); // Add authorName
    formData.append("bookTitle", bookTitle); // Add bookTitle
    formData.append("imageUrl", currentImage);
    formData.append("user_id", id);

    const response = await fetch(`${process.env.NEXT_PUBLIC_NODE_SERVER_URL}upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Error ${response.status}: ${errorResponse.message}`);
    }

    return null;
  } catch (error) {
    console.error("Error in postPDF:", error.message);
    throw new Error(`postPDF failed: ${error.message}`);
  }
}
