import random
from appwrite.client import Client
from appwrite.services.storage import Storage
from appwrite.input_file import InputFile
from appwrite.services.databases import Databases
from appwrite.id import ID
from appwrite.query import Query
import fitz 
import os

client = Client()
databases = Databases(client)
client.set_endpoint('https://cloud.appwrite.io/v1')
client.set_project('66dbf6d3002ec04e3664')
client.set_key('standard_7f83ce599e20e4325e1dedb03b06310e3abc565f44581b01cec43b7dda154d86a7fce26efcc28514aa1acca3ef6c9eedbace496e00be7a31a569c315a3abbc103af32f3a2b545150676864ecfcc8b2d0fbf2c07a4670587ead3700feb90881d812e71d82d948df276057e01ef8e168c96b589ac6bbb19222c1627be315fa3038')

storage = Storage(client)
database_id = '66e19d1d001c2f82d920'
books_collection_id = '6700e10f0005b5d2e535'
chunks_collection_id = '6700e1b700380f51b3eb'
image_extract = '/home/hyper/Desktop/proj/specials/getsomequotes/server/front_page_extract/'

def upload_pdf(pdf_path):
    result = storage.create_file(
        bucket_id='6700e87a00391724d5a6',
        file_id=ID.unique(),
        file=InputFile.from_path(pdf_path),
    )
    print("PDF uploaded successfully.")
    return result

def upload_pdf_image(pdf_path):
    doc = fitz.open(pdf_path)
    page = doc.load_page(0)
    images = page.get_images(full=True)

    if images:
        xref = images[0][0]
        image = doc.extract_image(xref)
        image_bytes = image["image"]
        os.makedirs(image_extract, exist_ok=True)
        output_path = os.path.join(image_extract, f"{ID.unique()}.png")

        with open(output_path, "wb") as img_file:
            img_file.write(image_bytes)

        result = storage.create_file(
            bucket_id='6700e87a00391724d5a6',
            file_id=ID.unique(),
            file=InputFile.from_path(output_path)
        )
        print("PDF image uploaded successfully.")
        return result
    else:
        print("No images found on the first page.")
    doc.close()

def add_upload_book_entry(data_obj):
    response = databases.create_document(
        database_id=database_id,
        collection_id=books_collection_id,
        document_id=ID.unique(),
        data=data_obj
    )
    print("Book entry added successfully.")
    return response

def upload_pdf_chunk(chunk_data):
    databases.create_document(
        database_id=database_id,
        collection_id=chunks_collection_id,
        document_id=ID.unique(),
        data=chunk_data
    )

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
