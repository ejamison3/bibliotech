"""File for crud applications

May split this into multiple files in future"""

from model import Book, Category, Author, Tag, User, Ratingdb

# categories and tags records are created in db_setup.py file. This is a one time creation. 

def create_book(
                title, 
                pub = None, 
                pub_year = None, 
                pgs = None, 
                cat_record = None, 
                user_record = None, 
                author_records = None, 
                tag_records = None):
    """Create new book record and return newly created book
    
        Any record should be as the record object. 
        Any plural record should be as a list of record objects, even if only one
        """

    temp_book = Book(title=title,
                    publisher=pub,
                    publication_year=pub_year,
                    pages=pgs)
    
    # need to add & commit now so that id is created
    db.session.add(temp_book)
    db.session.commit()

    # create relationship to categories table
    if cat_record:
        print(f'create relationship to categories table - NEED TO IMPLEMENT')
    
    # create relationship to authors table
        if author_records:
            print(f'create relationship to authors table - NEED TO IMPLEMENT')

    # create relationship to tags table
    if tag_records:
        print(f'create relationship to tags table - NEED TO IMPLEMENT')

    # create relationship to users table
    if user_record:
        print(f'create relationship to users table - NEED TO IMPLEMENT')

    return temp_book

    

# not all authors have first names
def create_author(lname, fname=None):
    """Create new author record and return newly created author"""

    temp_author = Author(fname=fname, lname=lname)
    db.session.add(temp_author)
    db.session.commit()

    return temp_author


def create_books_authors_relationship():
    """Create relationship between books and authors tables"""

    

def create_books_tags_relationship():
    """Create relationship between books and tags tables"""


def create_user(name, pw):
    """Create new user record and return newly created user"""

    # checks to be added here or done at info collection:
    #   username max of 20 chars
    #   password max of 30 chars
    #   user does not already exist (can this be done at DB level?)
    temp_user = User(username=name, password=pw)
    db.session.add(temp_user)
    db.session.commit()     # is there reason to not commit as frequently?

    return temp_user


def create_users_books_relationship():
    """Create relationship between users and books tables"""


def create_rating():
    """Create rating record and tie to users and books tables"""
