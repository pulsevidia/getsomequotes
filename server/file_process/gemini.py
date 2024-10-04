import os
import google.generativeai as genai
from google.generativeai import caching
import datetime
import time

genai.configure(api_key='AIzaSyDD8bqJ_3y_G1N1b2I9oKZ7ZLJt5yWnxNQ')

path_to_video_file = '../uploads/infinity.pdf'

# Upload the video using the Files API
video_file = genai.d_file(path=path_to_video_file)

# Wait for the file to finish processing
while video_file.state.name == 'PROCESSING':
  print('Waiting for video to be processed.')
  time.sleep(2)
  video_file = genai.get_file(video_file.name)

print(f'Video processing complete: {video_file.uri}')

# Create a cache with a 5 minute TTL
cache = caching.CachedContent.create(
    model='models/gemini-1.5-flash-001',
    display_name='The Beginning of Infinity', # used to identify the cache
    system_instruction=(
        'You job is the take book pdf and randomly pick section topic and make short form blog as if it was written by the author which most involves the exact sentences and paragraphs from it.'
    ),
    contents=[video_file],
    ttl=datetime.timedelta(minutes=5),
)

# Construct a GenerativeModel which uses the created cache.
model = genai.GenerativeModel.from_cached_content(cached_content=cache)

# Query the model
response = model.generate_content([(
'Randomly pick up a section from a books which can be read in solitude with need for context')])

print(response.usage_metadata)

# The output should look something like this:
# prompt_token_count: 696219
# cached_content_token_count: 696190
# candidates_token_count: 214
# total_token_count: 696433

print(response.text)
