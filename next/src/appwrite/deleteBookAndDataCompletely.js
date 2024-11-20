export async function deleteBookAndDataCompletely(id) {
  try {
    if (!id) {
      throw new Error("Invalid ID provided.");
    }

    // Send POST request to backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}delete-content`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    // Handle response
    if (response.ok) {
      const result = await response.json();
    } else {
      throw new Error(`Failed to delete content: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; // Throwing the error for further handling if needed
  }
}
