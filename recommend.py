from model import *

# SELECT book_id FROM ratings WHERE user_id = [user_id]
def get_book_id_from_rating_by_user_id(user_id):
    """Returns list of book_ids which the user has rated"""

    db.session.query(Rating.book_id).filter(Rating.user_id == user_id).all()
    # [(672,), (327,), (253,), (356,), (677,), (372,)]



# SELECT book_id FROM ratings WHERE book_id IN(508,231,811,136) GROUP BY book_id HAVING count(*) > 8;

# all book_ids the user has rated and at least one other person has also rated
# this returns the books to compare
# SELECT book_id FROM ratings WHERE book_id IN(SELECT book_id FROM ratings WHERE user_id = 4) GROUP BY book_id HAVING count(*) > 2;  

# This returns the users to compare
# SELECT user_id FROM ratings WHERE book_id IN(SELECT book_id FROM ratings WHERE book_id IN(SELECT book_id FROM ratings WHERE user_id = 4) GROUP BY book_id HAVING count(*) > 3) GROUP BY user_id;



if __name__ == '__main__':
    from server import app
    from model import connect_to_db

    connect_to_db(app)
    print('Connected to DB.')