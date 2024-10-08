import os
import sys
import uuid
import json

sys.path.append('/home/hyper/Desktop/proj/specials/getsomequotes/server/')
from _appwrite.appwrite import upload_pdf, upload_pdf_image, add_upload_book_entry, upload_pdf_chunk, retrive_5_percent_random_chunks, add_blogs_and_quote
from chunk_pdf import chunk_pdf
from ai_blog_processing import generate_10_blogs
import PyPDF2

project_id = '66dbf6d3002ec04e3664'
bucket_id = '6700e87a00391724d5a6'

def get_pdf_title(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        metadata = reader.metadata
        title = metadata.title if metadata.title else "No title found"
    print("PDF title retrieved.")
    return title

def file_process(pdf_path):
    pdf_upload_res = upload_pdf(pdf_path)
    print("PDF uploaded successfully.")

    pdf_id = pdf_upload_res['$id']
    pdf_url = f"https://cloud.appwrite.io/v1/storage/buckets/{bucket_id}/files/{pdf_id}/view?project={project_id}&project={project_id}&mode=admin"

    pdf_banner_res = upload_pdf_image(pdf_path)
    print("PDF image uploaded successfully.")

    pdf_image_id = pdf_banner_res['$id']
    pdf_image_url = f"https://cloud.appwrite.io/v1/storage/buckets/{bucket_id}/files/{pdf_image_id}/view?project={project_id}&project={project_id}&mode=admin"

    title = get_pdf_title(pdf_path)

    data_obj = {
        'book_name': title,
        'book_image': pdf_image_url,
        'pdf_link': pdf_url
    }

    upload_book_entry_res = add_upload_book_entry(data_obj)
    print("Book entry added successfully.")
    upload_book_entry_id = upload_book_entry_res['$id']

    chunks = chunk_pdf(pdf_path)
    print("PDF chunks created successfully.")

    print('Started to upload chunks...')
    for chunk in chunks:
        chunk_data = {
            'chunk_text': chunk,
            'books': upload_book_entry_id
        }
        upload_pdf_chunk(chunk_data)
    print("All chunks uploaded successfully.")

    five_percent_random_chunk = retrive_5_percent_random_chunks(upload_book_entry_id)
    print("Retrieved 5% random chunks.")

    filepath = f'{os.getcwd()}/selected_json/{uuid.uuid4}.txt'

    with open(filepath, 'w', encoding='utf-8') as text_file:
        for document in five_percent_random_chunk.get("documents", []):
            chunk_text = document.get('chunk_text', '')
            text_file.write(chunk_text + '\n')
            text_file.write('=' * 80)
    print("5% random chunks saved to file successfully.")

    blogs_and_quotes = generate_10_blogs(filepath)

    add_blogs_and_quote(blogs_and_quotes, upload_book_entry_id)

    print('All blogs and quotes are uploaded')
    print("Blog generation completed successfully.")

    print("It went successfully")