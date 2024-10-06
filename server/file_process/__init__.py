import os
import sys
import uuid
import json

sys.path.append('/home/hyper/Desktop/proj/specials/getsomequotes/server/')
from _appwrite.appwrite import upload_pdf, upload_pdf_image, add_upload_book_entry, upload_pdf_chunk, retrive_5_percent_random_chunks
from chunk_pdf import chunk_pdf
from ai_blog_processing import generate_10_blogs
import PyPDF2

project_id ='66dbf6d3002ec04e3664'
bucket_id = '6700e87a00391724d5a6'
pdf_path = '/home/hyper/Desktop/proj/specials/getsomequotes/server/uploads/infinity.pdf'

def get_pdf_title(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        metadata = reader.metadata
        title = metadata.title if metadata.title else "No title found"
    return title

def file_process():
    pdf_upload_res = upload_pdf(pdf_path)

    pdf_id = pdf_upload_res['$id']
    pdf_url = f"https://cloud.appwrite.io/v1/storage/buckets/{bucket_id}/files/{pdf_id}/view?project={project_id}&project={project_id}&mode=admin"

    pdf_banner_res = upload_pdf_image(pdf_path)

    pdf_image_id = pdf_banner_res['$id']
    pdf_image_url =  f"https://cloud.appwrite.io/v1/storage/buckets/{bucket_id}/files/{pdf_image_id}/view?project={project_id}&project={project_id}&mode=admin"

    title = get_pdf_title(pdf_path)

    data_obj = {
        'book_name': title,
        'book_image': pdf_image_url ,
        'pdf_link': pdf_url
    }

    upload_book_entry_res = add_upload_book_entry(data_obj)
    upload_book_entry_id = upload_book_entry_res['$id']

    chunks = chunk_pdf(pdf_path)

    for chunk in chunks:
        chunk_data = {
            'chunk_text': chunk,
            'books': upload_book_entry_id
        }
        upload_pdf_chunk(chunk_data)
   
    five_percent_random_chunk = retrive_5_percent_random_chunks(upload_book_entry_id)
    filepath = f'{os.getcwd()}/selected_json/{uuid.uuid4()}.txt'

    with open(filepath, 'w', encoding='utf-8') as text_file:
        for document in five_percent_random_chunk.get("documents",[]):
            chunk_text = document.get('chunk_text','')
            text_file.write(chunk_text + '\n')
            text_file.write('='*80)

    generate_10_blogs(filepath)

    print("It went successfully")

file_process()

# For Reference
"""
    {
    '$id': '6701030024dfd3823a1f',
    'bucketId': '6700e87a00391724d5a6', 
    '$createdAt': '2024-10-05T09:12:32.696+00:00', 
    '$updatedAt': '2024-10-05T09:12:32.696+00:00', 
    '$permissions': [], 
    'name': 'infinity.pdf', 
    'signature': 'b687208e0644f423edf625c8e4b3af41', 
    'mimeType': 'application/pdf', 
    'sizeOriginal': 2182138, 
    'chunksTotal': 1, 
    'chunksUploaded': 1
    }
"""
    
# https://cloud.appwrite.io/v1/storage/buckets/<bucket_id>/files/<file_id>/view?project=<project_id>&project=<project_id>&mode=admin