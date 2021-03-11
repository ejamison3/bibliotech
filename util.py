'''Helper functions'''

from crud import *

def get_author_data_from_book(book):
    '''Get author names from book record'''

    authors_records = book.authors
    authors = []        
    for author in authors_records:
        authors.append(f'{author.fname} {author.lname}')

    if len(authors) == 0:
        authors = None

    return authors

def get_book_rating_by_user_id(book, user_id):
    '''Get rating(s) for given book by user_id'''

    book_ratings = book.ratings
    if len(book_ratings) > 0:
        book_user_ratings = [rating for rating in book_ratings if str(rating.user_id) == user_id]

    if len(book_user_ratings) > 0:
        # there should only ever be a single rating per user/book combo
        return book_user_ratings[0]
    else: 
        print(f'Rating not found for book_id {book.id} and user_id {user_id}')
        return None


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
        if str(user.id) == str(user_id):
            return True
    
    return False


def books_to_dictionary(book_list, logged_in_user_id):
    '''Takes in a list of book records and turns into dictionary list of books'''

    list_book_dict = []
    
    for book in book_list:
        author_list = get_author_data_from_book(book)
        tag_list = get_tag_data_from_book(book)
        is_users = is_user_book(book, logged_in_user_id)

        # user rating
        if is_users == True:
            user_rating = get_book_rating_by_user_id(book, logged_in_user_id)
            user_score = user_rating.score if user_rating != None else None
            user_review = user_rating.review if user_rating != None else None
        else:
            user_score = None
            user_review = None

        temp_book = {
            'id' : book.id,
            'title': book.title,
            'authors': author_list,
            'description': book.description,
            'publisher': book.publisher,
            'year': book.publication_year,
            'isbn': book.isbn,
            'image': book.image_url,
            'avgRating': book.avg_rating,
            'tags': tag_list,
            'isUsers': is_users,
            'userScore': user_score,
            'userReview': user_review,
        }

        list_book_dict.append(temp_book)
    
    return list_book_dict


def book_to_dictionary(book, logged_in_user_id):
    '''Takes in a list of book records and turns into dictionary list of books'''
    
    author_list = get_author_data_from_book(book)
    tag_list = get_tag_data_from_book(book)
    is_users = is_user_book(book, logged_in_user_id)

    # user rating
    if is_users == True:
        user_rating = get_book_rating_by_user_id(book, logged_in_user_id)
        user_score = user_rating.score if user_rating != None else None
        user_review = user_rating.review if user_rating != None else None
    else:
        user_score = None
        user_review = None

    temp_book = {
        'id' : book.id,
        'title': book.title,
        'authors': author_list,
        'description': book.description,
        'publisher': book.publisher,
        'year': book.publication_year,
        'isbn': book.isbn,
        'image': book.image_url,
        'avgRating': book.avg_rating,
        'tags': tag_list,
        'isUsers': is_users,
        'userScore': user_score,
        'userReview': user_review,
    }
    
    return temp_book


def string_to_list(input_string):
    """takes comma separated input string and separates into list"""

    new_list = input_string.strip().split(',')

    return new_list

def calculate_update_avg_rating(book_id):
    """Calculate the average rating of a book by book ID"""

    rating_count = get_rating_count_by_book(book_id)
    rating_sum = get_rating_sum_by_book(book_id)
    avg_rating = rating_sum/rating_count

    # set avg rating on book record
    update_book_avg_rating(book_id, avg_rating)