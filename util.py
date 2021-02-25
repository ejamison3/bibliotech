'''Helper functions'''

from crud import *

def get_author_data_from_book(book):
    '''Get author names from book record'''

    authors_records = book.authors
    authors = []        
    for author in authors_records:
        authors.append(f'{author.lname}, {author.fname}')

    if len(authors) == 0:
        authors = None

    return authors


def get_tag_data_from_book(book):
    '''Get tag names from book record'''

    tags_records = book.tags
    tags = []
    for tag in tags_records:
        tags.append(tag.tag_name)

    if len(tags) == 0:
        tags = None
        
    return tags


def books_to_dictionary(book_list):
    '''Takes in a list of book records and turns into dictionary list of books'''

    list_book_dict = []
    
    for book in book_list:
        author_list = get_author_data_from_book(book)
        tag_list = get_tag_data_from_book(book)

        temp_book = {
            'title': book.title,
            'authors': author_list,
            'description': book.description,
            'publisher': book.publisher,
            'year': book.publication_year,
            'tag': tag_list,
        }

        list_book_dict.append(temp_book)
    
    return list_book_dict

def string_to_list(input_string):

    print(f'INPUT STRING: {input_string}')
    new_list = input_string.rstrip().split(',')

    print(f'NEW_LIST: {new_list}')
    return new_list