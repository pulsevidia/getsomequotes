export async function postPDF(files) {
  if (files.length === 0) {
    console.error("No file provided.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("pdf", files[0]); // Ensure the field name matches what the server expects ('pdf')

    const response = await fetch(
      `${import.meta.env.VITE_NODE_SERVER_URL}upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}
