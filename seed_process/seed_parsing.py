"""functions for parsing seed data"""

import json

def parse_nyt_lists():
    """parses the nyt_lists file and returns list of list names"""

    nyt_lists_json = open('nyt_lists.json')
    nyt_lists_dict = json.load(nyt_lists_json)
    lists = nyt_lists_dict["results"]  # this returns a list

    book_lists = []

    out_file = open('book_lists.txt', 'w')

    # loop through list and for each item extract the list name encoded value
    for item in lists:
        curr_list = item["list_name_encoded"]
        print({curr_list})

        out_file.write(curr_list + '\n')

    out_file.close()


def parse_nyt_book_list(filename):
    """Parse nyt book list json response into pipe-separated file

    output in format:
        title|authors|publisher|description|pages|publication date
            In cases of multiple authors, names are comma separated"""

    read_file_json = open(f'response_files/response_{filename}.json')
    read_file_dict = json.load(read_file_json)

    write_file = open(f'seed_data/{filename}', 'w')

    books = read_file_dict['results']['books']

    for book in books:
        # author is complicated 
        #    and used when multiple authors
        #    need to parse first and last name potentially. Can do this in crud function

        title = book['title']
        authors = book['author']
        publisher = book['publisher']
        description = book['description']

        # standardize some data
        title = title.title()
        authors = authors.replace(' and ',',')

        write_file.write(f'{title}|{authors}|{publisher}|{description}\n')

    read_file_json.close()
    write_file.close()


def parse_all_nyt_responses():
    """parse all response files using the file names in book_lists.txt"""

    book_list_file = open('book_lists.txt')

    for book in book_list_file:
        book = book.rstrip()
        parse_nyt_book_list(book)