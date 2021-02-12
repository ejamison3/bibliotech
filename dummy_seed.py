"""Create some dummy data"""
import crud
from model import db, Tag, Category
from random import randint

#categories & tags table have already been created

# create users
def make_dummy_users():
    """Create dummy users and return list of user records"""

    user_list = []
    for idx in range(10):
        curr_user = crud.create_user(f'user{idx}', f'{idx}{idx*2}{idx*3}{idx*4}')
        user_list.append(curr_user)
    
    return user_list


# create authors
def make_dummy_authors():
    """Create dummy authors and return list of author records"""

    author_list = []
    for idx in range(10):
        curr_author = crud.create_author(f'Doe{idx}', 'Jayne')
        author_list.append(curr_author)

    return author_list


def make_dummy_books():
    """Create dummy books and return list of book records"""

    book_list = []
    for idx in range(10):
        curr_book = crud.create_book(f'Title {idx}', 
                                     f'Pub House {idx}',
                                     f'199{idx}',
                                     f'10{idx}')
        book_list.append(curr_book)
    
    return book_list


# this is very dummy, assuming same amount of users, authors, and books
# Will need to rewrite with real data
def make_dummy_relationships(user_records, author_records, book_records):
    """Create relationships between users, authors and books tables"""

    tag_list = Tag.query.all()
    max_tag_idx = len(tag_list) - 1

    category_list = Category.query.all()
    max_cat_idx = len(category_list) - 1


    for idx, curr_book in enumerate(book_records):
        # create book, user, and author relationships
        crud.create_users_books_relationship(curr_book, user_records[idx])
        crud.create_books_authors_relationship(curr_book, author_records[idx])

        # create tag relationship
        curr_tag = tag_list[randint(0,max_tag_idx)]
        curr_cateogry = category_list[randint(0, max_cat_idx)]

        # create category relationship
        crud.create_books_tags_relationship(curr_book, curr_tag)
        crud.create_book_category_relationship(curr_book, curr_cateogry)

        # create rating (and relationship with ratings middle table)
        crud.create_rating(str(randint(1,5)), user_records[idx], curr_book)


def run_all_dummy():
    """Run all functions in this file"""

    dummy_users = make_dummy_users()
    dummy_authors = make_dummy_authors()
    dummy_books = make_dummy_books()

    make_dummy_relationships(dummy_users, dummy_authors, dummy_books)


# if running this file directly, it will drop and recreate the DB
if __name__ == "__main__":
    from server import app
    import os
    from model import connect_to_db
    from db_setup import create_categories, create_tags

    os.system('dropdb books')
    os.system('createdb books')

    connect_to_db(app)
    print("Connected to DB.")

    db.create_all()

    create_categories()
    create_tags()