import fitz  # PyMuPDF
import nltk
from nltk.tokenize import word_tokenize

# Download the punkt tokenizer if it hasn't been downloaded yet
nltk.download('punkt')

def chunk_pdf(pdf_path, chunk_size=1000):
    # Create an empty list to store the chunks
    chunks = []

    # Open the PDF file
    doc = fitz.open(pdf_path)
    full_text = ""

    # Extract text from each page
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        full_text += page.get_text() + "\n"

    # Tokenize the full text into words
    words = word_tokenize(full_text)

    # Create chunks of the specified size
    for i in range(0, len(words), chunk_size):
        chunk = words[i:i + chunk_size]
        chunks.append(' '.join(chunk))

    return chunks

# Example usage
pdf_path = 'topbook.pdf'  # Replace with your PDF file path
chunks = chunk_pdf(pdf_path)

# Save chunks to text files
for idx, chunk in enumerate(chunks):
    with open(f'chunk_{idx + 1}.txt', 'w', encoding='utf-8') as f:
        f.write(chunk)

print(f"Created {len(chunks)} chunks.")
