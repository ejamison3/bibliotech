"""File for crud applications

May split this into multiple files in future"""

from model import Book, Category, Author, Tag, User, Rating, db

# CURRENT PROBLEMS
# 1. No way to set has_read attribute in users_books table
# 2. Relationship between associations tables has problems. 
#    Needs to be fixed in model.py file but need to talk to Andrew

# categories and tags records are created in db_setup.py file. This is a one time creation. 

################################### CREATE FUNCTIONS ###########################

def create_book(
                title, 
                pub = None, 
                pub_year = None, 
                pgs = None, 
                descr = None,
                author_records = None, 
                tag_records = None,
                user_record = None,
                cat_record = None):
    """Create new book record and return newly created book
    
        Any record should be as the record object. 
        Any plural record should be as a list of record objects, even if only one
        """

    temp_book = Book(title=title,
                    publisher=pub,
                    description=descr,
                    publication_year=pub_year,
                    pages=pgs)
    
    # need to add & commit now so that id is created
    db.session.add(temp_book)
    db.session.commit()

    # create relationship to categories table
    if cat_record:
        create_book_category_relationship(temp_book, cat_record)
    
    # create relationship to authors table
    if author_records:
        for author_record in author_records:
            create_books_authors_relationship(temp_book, author_record)

    # create relationship to tags table
    if tag_records:
        for tag_record in tag_records:
            create_books_tags_relationship(temp_book, tag_record)

    # create relationship to users table
    if user_record:
        create_users_books_relationship(temp_book, user_record)

    return temp_book
  

def create_book_category_relationship(book_record, cat_record):
    """Create books to categories relationship"""
    
    cat_record.books.append(book_record)
    db.session.commit()


# not all authors have first names
def create_author(lname, fname=None):
    """Create new author record and return newly created author"""

    temp_author = Author(fname=fname, lname=lname)
    db.session.add(temp_author)
    db.session.commit()

    return temp_author


def create_books_authors_relationship(book_record, author_record):
    """Create relationship between books and authors tables"""

    book_record.authors.append(author_record)
    db.session.commit() # I don't believe I need to add?


def create_books_tags_relationship(book_record, tag_record):
    """Create relationship between books and tags tables
    
    arguments are single book and single author record
        If wanting to add multiple,need to call function multiple times"""
    
    book_record.tags.append(tag_record)
    db.session.commit()


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


def create_users_books_relationship(book_record, user_record):
    """Create relationship between users and books tables"""

    user_record.books.append(book_record)
    db.session.commit()


def create_users_books_tags_relationship(user_book_record, book_tag_record):
    """Create relationship between users_books table and books_tags table"""

    user_book_record.book_tags.append(book_tag_record)
    db.session.commit()


def create_rating(score, user_record, book_record, description=None):
    """Create rating record and tie to users and books tables"""

    temp_rating = Rating(score=score, description=description)
    db.session.add(temp_rating)
    db.session.commit()     # do now to create ratings.id?

    # create relationships to users and books tables
    user_record.ratings.append(temp_rating)
    book_record.ratings.append(temp_rating)

####################### SEARCH FUNCTIONS #######################################

def get_book_by_title(title):
    """Get book by title"""

    return Book.query.filter(Book.title == title).first()


def get_similar_books_by_title(title):
    """Get books with similar title"""

    title = f'%{title}%'
    return Book.query.filter(Book.title.like(title)).all()

def get_similar_books_by_title(title):
    """Get books with title"""

    return Book.query.filter(Book.title == title).all()


def get_user(username):
    """Get user by username"""
    
    return User.query.filter(User.username == username).first()


def get_author(lname, fname=None):
    """Get author by lname and fname if given"""

    return Author.query.filter(Author.lname == lname, Author.fname == fname).first()


def get_similar_tags(similar_phrase):
    """Get all tags with name similar to similar_phrase"""

    return Tag.query.filter(Tag.tag_name.like(f'%{similar_phrase}%')).all()

    

if __name__ == "__main__":
    from server import app
    from model import connect_to_db

    connect_to_db(app)
    print("Connected to DB.")