import google.generativeai as genai
from google.generativeai import caching
import uuid
import datetime
import time

# Configure the API key
genai.configure(api_key='AIzaSyDD8bqJ_3y_G1N1b2I9oKZ7ZLJt5yWnxNQ')

# Corrected queries with grammar fixes
blog_query = ('From all the chunks given, generate a blog out of them such that it contains the exact lines, paragraphs, '
              'and quotes. At the same time, you have to pick them in such a way that they can be understood in solitude '
              'without the need for any prior context, and it should also feel like a blog, not like you are reading an '
              'extract from a book. Organize them creatively.')

quote_query = ('From all the chunks given, generate a quote out of them such that it contains the exact lines, paragraphs, '
               'and quotes. At the same time, you have to pick them in such a way that they can be understood in solitude '
               'without the need for any prior context.')


def generate_10_blogs(filepath):
    # Upload the file
    file = genai.upload_file(path=filepath)
    while file.state.name == 'PROCESSING':
        print('Waiting for file to be processed.')
        time.sleep(2)
        file = genai.get_file(file.name)

    # Create a cache with a 5-minute TTL
    cache = caching.CachedContent.create(
        model='models/gemini-1.5-flash-001',
        display_name=str(uuid.uuid4()),
        system_instruction=(
            'You are going to be given a JSON file that contains random 1000-word chunks from books with their names. '
            'You have to digest all of them and return the response in markdown. Each time you must give a different response '
            'regardless of the query. Be creative.'
        ),
        contents=[file],
        ttl=datetime.timedelta(minutes=5),
    )

    # Construct a GenerativeModel which uses the created cache
    model = genai.GenerativeModel.from_cached_content(cached_content=cache)

    blog_list = []
    quotes_list = []

    # Generate 10 blogs
    for _ in range(10):
        response = model.generate_content([blog_query])
        blog_list.append(response.text)

    # Generate 50 quotes
    for _ in range(50):
        response = model.generate_content([quote_query])
        quotes_list.append(response.text)

    # Print usage metadata
    print(response.usage_metadata)

    return [blog_list, quotes_list]
