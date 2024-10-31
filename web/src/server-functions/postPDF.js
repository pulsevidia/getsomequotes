export async function postPDF({ file, authorName, bookTitle, currentImage }) {
  if (!file || file.length === 0) {
    throw new Error("No file provided.");
  }

  try {
    const formData = new FormData();
    formData.append("pdf", file[0]); // Attach the file with the key "pdf"
    formData.append("authorName", authorName); // Add authorName
    formData.append("bookTitle", bookTitle); // Add bookTitle
    formData.append("imageUrl", currentImage);

    const response = await fetch(
      `${import.meta.env.VITE_NODE_SERVER_URL}upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Error ${response.status}: ${errorResponse.message}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in postPDF:", error.message);
    throw new Error(`postPDF failed: ${error.message}`);
  }
}
