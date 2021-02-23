"""Helper functions"""

from crud import *


def turn_books_to_dictionary(book_list):
    """Takes in a list of book records and turns into dictionary list of books"""

    # output format: {
    #       title: 'Best Book Ever',
    #       author_fname: 'Jane',
    #       author_lname: 'Doe',
    # }
    pass


##############SEARCH (USER)##############

def get_user_booklist_title(user_id, title):
    """Get books by title and user ID

    Return: list of dictionaries - each dictionary represents a book
        If no books found, return None"""

    books = db.session.
    
    return None

def get_user_booklist_title_author(userid, title, author):
    """Get books by title, author, and user ID

    Return: list of dictionaries - each dictionary represents a book
        If no books found, return None"""

    return [{
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Janne',
        'publisher': 'Random House',
    },
    {
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Joan',
        'publisher': 'Random House',
    }]
    

def get_user_booklist_title_author_tag(user_id, title, author, tag):
    """Get books by title, author, tag, and user ID

    Return: list of dictionaries - each dictionary represents a book
        If no books found, return None"""

    return [{
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Janne',
        'publisher': 'Random House',
    },
    {
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Joan',
        'publisher': 'Random House',
    }]

def get_user_booklist_title_tag(user_id, title, tag):
    """Get books by title, tag, and user ID

    Return: list of dictionaries - each dictionary represents a book
        If no books found, return None"""

    return [{
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Janne',
        'publisher': 'Random House',
    },
    {
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Joan',
        'publisher': 'Random House',
    }]


def get_user_booklist_author(userid, author):
    """Get books by author, and user ID

    Return: list of dictionaries - each dictionary represents a book
        If no books found, return None"""

    return [{
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Janne',
        'publisher': 'Random House',
    },
    {
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Joan',
        'publisher': 'Random House',
    }]


def get_user_booklist_author_tag(userid, author, tag):
    """Get books by author, tag, and user ID

    Return: list of dictionaries - each dictionary represents a book
        If no books found, return None"""

    return [{
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Janne',
        'publisher': 'Random House',
    },
    {
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Joan',
        'publisher': 'Random House',
    }]


def get_user_booklist_tag(userid, tag):
    """Get books by tag and user ID

    Return: list of dictionaries - each dictionary represents a book
        If no books found, return None"""
    
    return [{
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Janne',
        'publisher': 'Random House',
    },
    {
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Joan',
        'publisher': 'Random House',
    }]


######SEARCH ALL (NO USER)#######
def get_booklist_title(title):
    """Get books by title

    Return: list of dictionaries - each dictionary represents a book
        If no books found, return None"""

    return None

def get_booklist_title_author(title, author):
    """Get books by title and author

    Return: list of dictionaries - each dictionary represents a book
        If no books found, return None"""

    return [{
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Janne',
        'publisher': 'Random House',
    },
    {
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Joan',
        'publisher': 'Random House',
    }]
    

def get_booklist_title_author_tag(title, author, tag):
    """Get books by title, author, and tag

    Return: list of dictionaries - each dictionary represents a book
        If no books found, return None"""

    return [{
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Janne',
        'publisher': 'Random House',
    },
    {
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Joan',
        'publisher': 'Random House',
    }]

def get_booklist_title_tag(title, tag):
    """Get books by title and tag

    Return: list of dictionaries - each dictionary represents a book
        If no books found, return None"""

    return [{
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Janne',
        'publisher': 'Random House',
    },
    {
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Joan',
        'publisher': 'Random House',
    }]


def get_booklist_author(author):
    """Get books by author

    Return: list of dictionaries - each dictionary represents a book
        If no books found, return None"""

    return [{
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Janne',
        'publisher': 'Random House',
    },
    {
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Joan',
        'publisher': 'Random House',
    }]


def get_booklist_author_tag(author, tag):
    """Get books by author and tag

    Return: list of dictionaries - each dictionary represents a book
        If no books found, return None"""

    return [{
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Janne',
        'publisher': 'Random House',
    },
    {
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Joan',
        'publisher': 'Random House',
    }]


def get_booklist_tag(tag):
    """Get books by tag

    Return: list of dictionaries - each dictionary represents a book
        If no books found, return None"""
    
    return [{
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Janne',
        'publisher': 'Random House',
    },
    {
        'title': 'BookTitle',
        'author_lname': 'Doe',
        'author_fname': 'Joan',
        'publisher': 'Random House',
    }]