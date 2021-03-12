'''Helper functions'''

from crud import *
import random

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


def get_common_users(user_id):
    """return common users"""

    # get all ratings for this user
    ratings_by_primary_user_list = get_ratings_by_user_id(user_id)
    print(f'USER HAS RATED {len(ratings_by_primary_user_list)} BOOKS')

    # get all books rated by this user (user_book_id_list)
    user_book_id_list = []                       # should only be one user rating per book_id
    for rating_record in ratings_by_primary_user_list:
        user_book_id_list.append(rating_record.book_id)
    
    # if user has not rated any books, there are no common users
    if len(user_book_id_list) == 0:
        return []

    # get all rating records with book_id in book_id_list
    ratings_by_book_id_list = get_ratings_by_book_id_list(user_book_id_list)

    # get users who also rated these books (similar_users_set)
    common_users_set = set()                # using set bc there will be duplicate users
    for rating_record in ratings_by_book_id_list:
        common_users_set.add(rating_record.user_id)

    # remove googleHivemind since they have rated ALL books
    user = get_user('googleHivemind')
    if user != None:
        common_users_set.remove(user.id)
    
    return list(common_users_set)


def get_book_recommendation(user_id):
    """Return random other book rated by user who has rated same book
    
    Error messages are: 
        no_rated_books
        no common users
        same books rated
    """

    # get all ratings for this user
    ratings_by_primary_user_list = get_ratings_by_user_id(user_id)
    print(f'USER HAS RATED {len(ratings_by_primary_user_list)} BOOKS')

    # get all books rated by this user (user_book_id_list)
    user_book_id_list = []                       # should only be one user rating per book_id
    for rating_record in ratings_by_primary_user_list:
        user_book_id_list.append(rating_record.book_id)
    
    if len(user_book_id_list) == 0:
        return 'no_rated_books'

    # get all rating records with book_id in book_id_list
    ratings_by_book_id_list = get_ratings_by_book_id_list(user_book_id_list)
    print(f'THERE ARE {len(ratings_by_book_id_list)} RATINGS FOR THE BOOKS USER HAS READ')
    if len(ratings_by_book_id_list) == 0:
        return 'no common users'

    # get users who also rated these books (similar_users_set)
    common_users_set = set()                # using set bc there will be duplicate users
    for rating_record in ratings_by_book_id_list:
        common_users_set.add(rating_record.user_id)
    
    # remove google books user bc they have rating for ALL books
    common_users_set.remove(1)
    print(f'COMMON USERS ARE {common_users_set}')
    # enhancement - find most similar user using Pearson correlation


    common_users_list = get_common_users(user_id)
    # get ratings from these users where books not in user_book_id_list
    ratings_by_other_users = get_ratings_by_user_ids_not_book_id(common_users_list, user_book_id_list)

    if len(ratings_by_other_users) == 0:
        return 'same books rated'

    print(f'COMMON USERS HAVE {len(ratings_by_other_users)} RATINGS')
    # return a random book id from ratings_by_other_users
    max_val = len(ratings_by_other_users) - 1
    rand_int = random.randint(0, max_val)
    random_rating = ratings_by_other_users[rand_int]
    
    return random_rating.book_id