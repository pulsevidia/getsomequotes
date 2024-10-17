
export async function postPDF(files) {
    if (files.length === 0) {
      console.error("No file provided.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('pdf', files[0]); // Ensure the field name matches what the server expects ('pdf')

      const response = await fetch('https://quotes-server-z2fk.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result)
    } catch (error) {
    }
  }
 