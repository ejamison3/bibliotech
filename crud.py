'''File for crud applications

May split this into multiple files in future'''

from model import *

# CURRENT PROBLEMS
# 1. No way to set has_read attribute in users_books table
# 2. Relationship between associations tables has problems. 
#    Needs to be fixed in model.py file but need to talk to Andrew

# categories and tags records are created in db_setup.py file. This is a one time creation. 

################################### CREATE FUNCTIONS ###########################

def create_book(
                title, 
                pub = None, 
                descr = None,
                pub_year = None, 
                pgs = None, 
                isbn = None,
                image_url = None,
                author_records = None, 
                tag_records = None,
                user_record = None,
                cat_record = None):
    '''Create new book record and return newly created book
    
        Any record should be as the record object. 
        Any plural record should be as a list of record objects, even if only one
        '''

    temp_book = Book(title=title,
                    publisher=pub,
                    description=descr,
                    publication_year=pub_year,
                    pages=pgs,
                    isbn=isbn,
                    image_url=image_url)
    
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
    '''Create books to categories relationship'''
    
    cat_record.books.append(book_record)
    db.session.commit()


# not all authors have first names
def create_author(lname, fname=None):
    '''Create new author record and return newly created author'''

    temp_author = Author(fname=fname, lname=lname)
    db.session.add(temp_author)
    db.session.commit()

    return temp_author


def create_books_authors_relationship(book_record, author_record):
    '''Create relationship between books and authors tables'''

    book_record.authors.append(author_record)
    db.session.commit() # I don't believe I need to add?


def create_books_tags_relationship(book_record, tag_record):
    '''Create relationship between books and tags tables
    
    arguments are single book and single author record
        If wanting to add multiple,need to call function multiple times'''
    
    book_record.tags.append(tag_record)
    db.session.commit()


def create_user(name, pw):
    '''Create new user record and return newly created user'''

    # checks to be added here or done at info collection:
    #   username max of 20 chars
    #   password max of 30 chars
    #   user does not already exist (can this be done at DB level?)
    temp_user = User(username=name, password=pw)
    db.session.add(temp_user)
    db.session.commit()     

    return temp_user


def create_tags(tag):
    """creates tag record in tags table"""

    temp_tag = Tag(tag_name=tag)
    db.session.add(temp_tag)
    
    db.session.commit()

    return temp_tag


def create_categories(category):
    """creates category records in the categories table"""

    temp_category = Category(category_name=category)
    db.session.add(temp_category)
    
    db.session.commit()


def create_users_books_relationship(book_record, user_record):
    '''Create relationship between users and books tables'''

    user_record.books.append(book_record)
    db.session.commit()


def create_users_books_tags_relationship(user_book_record, book_tag_record):
    '''Create relationship between users_books table and books_tags table'''

    user_book_record.book_tags.append(book_tag_record)
    db.session.commit()


def create_rating(score, user_record, book_record, review=None):
    '''Create rating record and tie to users and books tables'''

    temp_rating = Rating(score=score, review=review)
    db.session.add(temp_rating)
    db.session.commit()     # do now to create ratings.id?

    # create relationships to users and books tables
    user_record.ratings.append(temp_rating)
    book_record.ratings.append(temp_rating)

    db.session.commit()

####################### SEARCH FUNCTIONS #######################################

###FIND BOOKS##

def get_book_by_id(id):
    '''get book record by id'''

    return Book.query.filter(Book.id == id).first()


def get_book_by_isbn(isbn):
    """Return single book with matching isnb or None"""

    return Book.query.filter(Book.isbn == isbn).first()


def get_book_by_title(title):
    '''Get book by title
    
    Returns list of books'''

    return Book.query.filter(Book.title == title).first()


def get_all_ratings_book_ids():
    '''Get list of unique book_ids in ratings table'''

    return Rating.query.with_entities(Rating.book_id).group_by(Rating.book_id).all()

# may not be using this...check
def get_books_by_title(title):
    '''Get books with title'''

    return Book.query.filter(Book.title == title).all()


def get_books_by_various(title=None, 
                        author_lname=None, 
                        tag_list=None,
                        isbn=None,
                        user_id=None):

    q = Book.query

    if title != None:
        q = q.filter(Book.title.ilike(f'%{title}%'))
    
    if author_lname != None:
        q = q.join(BookAuthor).join(Author)
        q = q.filter(Author.lname.ilike(author_lname))
    else:
        q = q.options(db.joinedload('authors'))

    if tag_list != None:
        q = q.join(BookTag).join(Tag)
        terms = []
        for tag in tag_list:
            tag = tag.strip()
            terms.append(Tag.tag_name.ilike(tag))

        q = q.filter(db.or_(*terms))
    else:
        q = q.options(db.joinedload('tags'))

    if isbn != None:
        q = q.filter(Book.isbn.ilike(isbn))

    if user_id != None:
        q = q.join(UserBook).join(User)
        q = q.filter(User.id == user_id)
    else:
        q = q.options(db.joinedload('users'))
    
    return q.all()


def get_books_by_various_advanced(title=None, 
                                author_fname= None,
                                author_lname=None, 
                                tag_list=None,
                                isbn=None,
                                user_id=None,
                                exact_title=False,
                                exact_fname=False,
                                exact_lname=False):

    q = Book.query

    if title != None:
        if exact_title:
            q = q.filter(Book.title.ilike(title))       # case insensitive
        else:
            q = q.filter(Book.title.ilike(f'%{title}%'))
    
    if author_fname != None or author_lname != None:
        q = q.join(BookAuthor).join(Author)

        # Author First Name
        if author_fname != None:
            if exact_fname:
                q = q.filter(Author.fname.ilike(author_fname))
            else:
                q = q.filter(Author.fname.ilike(f'%{author_fname}%'))

        # Author Last Name
        if author_lname != None:
            if exact_lname:
                q = q.filter(Author.lname.ilike(author_lname))
            else:
                q = q.filter(Author.lname.ilike(f'%{author_lname}%'))
    else:
        q = q.options(db.joinedload('authors'))

    if tag_list != None:
        q = q.join(BookTag).join(Tag)
        terms = []
        for tag in tag_list:
            tag = tag.strip()
            terms.append(Tag.tag_name.ilike(tag))

        q = q.filter(db.or_(*terms))
    else:
        q = q.options(db.joinedload('tags'))
    
    if isbn != None:
        q = q.filter(Book.isbn.ilike(isbn))

    if user_id != None:
        q = q.join(UserBook).join(User)
        q = q.filter(User.id == user_id)
    else:
        q = q.options(db.joinedload('users'))
    
    return q.all()

###FIND OTHER THINGS##

def get_user(username):
    '''Get user by username'''
    
    return User.query.filter(User.username == username).first()


def get_user_by_id(id):
    """Get user by ID"""

    return User.query.filter(User.id == id).first()


def get_author(lname, fname=None):
    '''Get author by lname and fname if given'''

    return Author.query.filter(Author.lname == lname, Author.fname == fname).first()


def get_tag(tag_name):
    '''Get tag record'''

    return Tag.query.filter(Tag.tag_name == tag_name).first()


def get_rating_by_user_book(book_id, user_id):
    '''Get rating record by user ID and book ID)'''

    return Rating.query.filter(Rating.book_id == book_id, Rating.user_id == user_id).first()


def get_rating_count_by_book(book_id):
    '''Get total number of ratings by Book ID'''

    return Rating.query.filter(Rating.book_id == book_id).count()

def get_rating_sum_by_book(book_id):
    '''Get total sum of ratings by Book ID'''

    # this will fail until Rating.score is changed to int
    return Rating.query.with_entities(db.func.sum(Rating.score)).filter(Rating.book_id == book_id).scalar()

def get_similar_tags(similar_phrase):
    '''Get all tags with name similar to similar_phrase'''

    return Tag.query.filter(Tag.tag_name.like(f'%{similar_phrase}%')).all()

####################################### UPDATE #######################################

def update_book_avg_rating(book_id, avg_rating):
    '''Update average rating by book ID'''

    book_record = get_book_by_id(book_id)
    book_record.avg_rating = avg_rating
    db.session.commit()

def update_book_user_score(book_id, user_id, score):
    '''Update score in ratings table by book_id/user_id combo'''

    rating_record = get_rating_by_user_book(book_id, user_id)
    if rating_record != None:
        rating_record.score = score
    else:
        # create record
        user_record = get_user_by_id(user_id)
        book_record = get_book_by_id(book_id)
        create_rating(score, user_record, book_record, review=None)

def update_book_user_review(book_id, user_id, review):
    '''Update review in ratings table by book ID/user ID combo'''

    rating_record = get_rating_by_user_book(book_id, user_id)
    if rating_record != None:
        rating_record.review = review
    else:
        return "failure"



#######################################DELETE#######################################

def remove_users_books_relationship(book_record, user_record):
    """Removes relationship between user and book"""

    book_record.users.remove(user_record)
    db.session.commit()


if __name__ == '__main__':
    from server import app
    from model import connect_to_db

    connect_to_db(app)
    print('Connected to DB.')