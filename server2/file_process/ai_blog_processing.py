import google.generativeai as genai
from google.generativeai import caching
import uuid
import datetime
import time

genai.configure(api_key='AIzaSyDD8bqJ_3y_G1N1b2I9oKZ7ZLJt5yWnxNQ')

def generate_10_blogs(filepath):
    file = genai.upload_file(path=filepath)
    while file.state.name == 'PROCESSING':
        print('Waiting for video to be processed.')
        time.sleep(2)
        file = genai.get_file(file.name)

    # Create a cache with a 5 minute TTL
    cache = caching.CachedContent.create(
        model='models/gemini-1.5-flash-001',
        display_name=f"{uuid.uuid4()}",
        system_instruction=(
            'You are going to be give a json file that contains random 1000 words chunks from the books with their name, you have to digest all of them and you will return response in markdown'
        ),
        contents=[file],
        ttl=datetime.timedelta(minutes=5),
    )

    # Construct a GenerativeModel which uses the created cache.
    model = genai.GenerativeModel.from_cached_content(cached_content=cache)

    # Query the model
    response = model.generate_content([(
        'From all the chunks given generate a blog out of them such that the will contains the exact lines, paragraphs and quotes.'
    )])

    print(response.usage_metadata)

    # The output should look something like this:
    # prompt_token_count: 696219
    # cached_content_token_count: 696190
    # candidates_token_count: 214
    # total_token_count: 696433

    print(response.text)
