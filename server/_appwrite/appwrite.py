import os
import random
import fitz
from appwrite.client import Client
from appwrite.services.storage import Storage
from appwrite.input_file import InputFile
from appwrite.services.databases import Databases
from appwrite.id import ID

# Appwrite setup
client = Client()
client.set_endpoint('https://cloud.appwrite.io/v1') \
      .set_project('66dbf6d3002ec04e3664') \
      .set_key('standard_7f83ce599e20e4325e1dedb03b06310e3abc565f44581b01cec43b7dda154d86a7fce26efcc28514aa1acca3ef6c9eedbace496e00be7a31a569c315a3abbc103af32f3a2b545150676864ecfcc8b2d0fbf2c07a4670587ead3700feb90881d812e71d82d948df276057e01ef8e168c96b589ac6bbb19222c1627be315fa3038')

# Service instances
storage = Storage(client)
databases = Databases(client)

# Constants
DATABASE_ID = '66e19d1d001c2f82d920'
BOOKS_COLLECTION_ID = '6700e10f0005b5d2e535'
CHUNKS_COLLECTION_ID = '6700e1b700380f51b3eb'
BLOGS_COLLECTION_ID = '6700e29b003102d59380'
QUOTE_COLLECTION_ID = '6700e2e100214d91e13e'
BUCKET_ID = '6700e87a00391724d5a6'
IMAGE_EXTRACT_PATH = '/home/hyper/Desktop/proj/specials/getsomequotes/server/front_page_extract/'

def upload_pdf(pdf_path):
    try:
        result = storage.create_file(
            bucket_id=BUCKET_ID,
            file_id=ID.unique(),
            file=InputFile.from_path(pdf_path),
        )
        print("PDF uploaded successfully.")
        return result
    except Exception as e:
        print(f"Error uploading PDF: {e}")

def upload_pdf_image(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        page = doc.load_page(0)
        images = page.get_images(full=True)
        
        if not images:
            print("No images found on the first page.")
            return

        # Extract image and save
        xref = images[0][0]
        image = doc.extract_image(xref)
        image_bytes = image["image"]
        os.makedirs(IMAGE_EXTRACT_PATH, exist_ok=True)
        output_path = os.path.join(IMAGE_EXTRACT_PATH, f"{ID.unique()}.png")

        with open(output_path, "wb") as img_file:
            img_file.write(image_bytes)

        # Upload image
        result = storage.create_file(
            bucket_id=BUCKET_ID,
            file_id=ID.unique(),
            file=InputFile.from_path(output_path)
        )
        print("PDF image uploaded successfully.")
        return result
    except Exception as e:
        print(f"Error uploading PDF image: {e}")
    finally:
        doc.close()

def add_upload_book_entry(data_obj):
    try:
        response = databases.create_document(
            database_id=DATABASE_ID,
            collection_id=BOOKS_COLLECTION_ID,
            document_id=ID.unique(),
            data=data_obj
        )
        print("Book entry added successfully.")
        return response
    except Exception as e:
        print(f"Error adding book entry: {e}")

def upload_pdf_chunk(chunk_data):
    try:
        databases.create_document(
            database_id=DATABASE_ID,
            collection_id=CHUNKS_COLLECTION_ID,
            document_id=ID.unique(),
            data=chunk_data
        )
    except Exception as e:
        print(f"Error uploading PDF chunk: {e}")

def add_blogs_and_quote(books_and_quote_array, book_id):
    try:
        blogs, quotes = books_and_quote_array
        for blog in blogs:
            databases.create_document(
                database_id=DATABASE_ID,
                collection_id=BLOGS_COLLECTION_ID,
                document_id=ID.unique(),
                data={
                    'blog_markdown': blog,
                    'books': book_id
                }
            )
        for quote in quotes:
            databases.create_document(
                database_id=DATABASE_ID,
                collection_id=QUOTE_COLLECTION_ID,
                document_id=ID.unique(),
                data={
                    'quote_text': quote,
                    'books': book_id
                }
            )
        print("Blogs and quotes uploaded successfully.")
    except Exception as e:
        print(f"Error uploading blogs and quotes: {e}")

'''
def retrive_5_percent_random_chunks(book_id):
    result = databases.list_documents(
        database_id=database_id,
        collection_id=chunks_collection_id,
        queries=[
            Query.select(["$id"]),
            Query.equal("books", [book_id]),
            Query.limit(198391283)
        ]
    )
    print("Retrieved all chunk IDs.")

    all_ids = [doc['$id'] for doc in result['documents']]
    sample_size = max(1, len(all_ids) * 50 // 100)
    random_ids = random.sample(all_ids, sample_size)
    print(len(all_ids), len(all_ids)*len(random_ids)//50)
    print("Selected random chunk IDs.")

    five_percent_chunks_result = databases.list_documents(
        database_id=database_id,
        collection_id=chunks_collection_id,
        queries=[
            Query.equal('$id', random_ids)
        ]
    )
    print("Retrieved 5% random chunks.")
    return five_percent_chunks_result
'''