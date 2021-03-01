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

def is_user_book(book, user_id):
    '''Determine if book belongs to user_id'''

    users_records = book.users
    for user in users_records:
        if user.id == user_id:
            return True
    
    return False


def books_to_dictionary(book_list, logged_in_user_id):
    '''Takes in a list of book records and turns into dictionary list of books'''

    list_book_dict = []
    
    for book in book_list:
        author_list = get_author_data_from_book(book)
        tag_list = get_tag_data_from_book(book)
        is_users = is_user_book(book, logged_in_user_id)

        temp_book = {
            'id' : book.id,
            'title': book.title,
            'authors': author_list,
            'description': book.description,
            'publisher': book.publisher,
            'year': book.publication_year,
            'tags': tag_list,
            'isUsers': is_users,
        }

        list_book_dict.append(temp_book)
    
    return list_book_dict


def book_to_dictionary(book):
    '''Takes in a list of book records and turns into dictionary list of books'''
    
    author_list = get_author_data_from_book(book)
    tag_list = get_tag_data_from_book(book)

    temp_book = {
        'id' : book.id,
        'title': book.title,
        'authors': author_list,
        'description': book.description,
        'publisher': book.publisher,
        'year': book.publication_year,
        'tags': tag_list,
    }
    
    return temp_book


def string_to_list(input_string):
    """takes comma separated input string and separates into list"""

    new_list = input_string.rstrip().split(',')

    return new_list