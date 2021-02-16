"""Make calls to nytimes books to get data"""

import requests
import os
import time

book_lists = open('book_lists.txt')

nyt_api_key = os.environ['NYT_API_KEY']
api_key = {'api-key': nyt_api_key}


for book_list in book_lists:
    book_list = book_list.rstrip()

    res = requests.get(f'https://api.nytimes.com/svc/books/v3/lists/current/{book_list}', params=api_key)
    res_text = res.text

    write_file = open(f'response_files/response_{book_list}.json', 'w')
    write_file.write(res_text)

    time.sleep(10)


book_lists.close()