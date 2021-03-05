import json
import os
import time
import requests
import crud


#########################CREATE SEED FILES########################################

def create_google_seed_file(book_id_file, book_seed_file, error_file):

    asin_list = open(book_id_file)
    # asin is what review data calls isbn

    seed_file = open(book_seed_file, 'a')
    failed_file = open(error_file, 'a')

    for isbn in asin_list:
        isbn = isbn.rstrip()

        books_api_key = os.environ['GOOGLE_BOOKS_API_KEY']
        api_key = {'key': books_api_key}

        res = requests.get(f'https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}', params=api_key)
        print(f'res: {res}')
        res_dict = res.json()
        total_books = res_dict['totalItems']
        if total_books == 0:
            failed_file.write(f'{isbn}\n')
        else:
            if total_books > 1:
                failed_file.write(f'{isbn} TOTAL: {total_books}\n')
            else:
                volume_info = res_dict['items'][0]['volumeInfo']
                # isbn is hard to get out of file so add as a separate key
                volume_info['isbn'] = isbn
                volume_info_json = json.dumps(volume_info)
                seed_file.write(f'{volume_info_json}\n')

        time.sleep(1)
    
    seed_file.close()
    failed_file.close()
        

######################### - POPULATE DATABASE - #################################
def create_authors(author_list):
    """Create author record, return list of author records"""

    author_record_list = []
    for author in author_list:
        # last word is last name, all words are first name
        author_names = author.rstrip().split()
        lname = author_names[-1]
        if len(author_names) > 1:
            fname = ' '.join(author_names[0:-1])
        else:
            None

        # see if author with exact lname and fname exist
        temp_author = crud.get_author(lname, fname)

        if temp_author == None:
            temp_author = crud.create_author(lname, fname)
        
        # save author record(s)
        author_record_list.append(temp_author)

    return author_record_list


def create_tags_from_list(tags_list):
    """Create or find tags, return list of tag records"""

    tags_record_list = []
    print(tags_list)
    for tag in tags_list:
        curr_tag = crud.get_tag(tag)
        if curr_tag is None:
            curr_tag = crud.create_tags(tag)
        
        tags_record_list.append(curr_tag)
    
    return tags_record_list


def create_book_author(filename):
    """Create book, author"""

    f = open(filename)

    # create google user for additional ratings
    user = crud.get_user('googleHivemind')

    if user is None:
        user = crud.create_user('googleHivemind', '1234')

    for line in f:
        book_dict = json.loads(line)
        title = book_dict.get('title', None)
        pub = book_dict.get('publisher', None)
        descr = book_dict.get('description', None)
        pub_year = book_dict.get('publishedDate', None)
        pages = book_dict.get('pageCount', None)
        isbn = book_dict.get('isbn', None)
        
        # add in adding google rating to google user
        g_rating = book_dict.get('averageRating', None)

        
        # not all imageLinks have thumbnails
        images = book_dict.get('imageLinks',None)
        if images is not None:
            image_url = images.get('thumbnail', None)  
        else:
            image_url = None
        
        
        tags_list = book_dict.get('categories', None)

        # clean up data
        if len(pub_year) > 4:
            pub_year = int(pub_year[:4])


        

        author_list = book_dict.get('authors', None)
        author_record_list = None
        if author_list is not None:
            author_record_list = create_authors(author_list)

        # create or get tags
        if tags_list is not None:
            tags_record_list = create_tags_from_list(tags_list)
        
        # create book if it doesn't exist yet
        title = title.rstrip()
        temp_book = crud.get_book_by_title(title)

        if temp_book == None:
            if len(author_record_list) == 0:
                author_record_list = None
            temp_book = crud.create_book(title, pub=pub, descr=descr, pub_year=pub_year, pgs=pages, isbn=isbn, image_url=image_url, author_records=author_record_list, tag_records=tags_record_list)

        
        # add rating for google user
        if g_rating is not None:
            g_rating = str(int(g_rating))
            crud.create_rating(g_rating, user, temp_book)


def create_user_rating(filename, error_file):
    """Create User and Rating records and tie in accordingly"""
     
    f = open(filename)

    # holds reviewerID and isbn of reviews for books not found
    failed_file = open(error_file, 'a')

    # create google user for additional ratings
    user = crud.get_user('googleHivemind')

    if user is None:
        user = crud.create_user('googleHivemind', '1234')

    for line in f:
        review_dict = json.loads(line)
        user_name = review_dict['reviewerID']
        rating_fl = review_dict.get('overall', None)
        rating_desc = review_dict.get('reviewText', None)
        isbn = review_dict.get('asin', None)
    
        # find or create user
        temp_user = crud.get_user(user_name)
        if temp_user is None:
            temp_user = crud.create_user(user_name, '1234')
        
        # find book
        temp_book = crud.get_book_by_isbn(isbn)
        if temp_book is not None:
            # link user & book
            crud.create_users_books_relationship(temp_book, temp_user)

            # create and link rating to user and book
            if rating_fl is not None:
                rating = str(int(rating_fl))
                crud.create_rating(rating, temp_user, temp_book, rating_desc)
        else:
            failed_file.write(f'{user_name} {isbn}\n')

    f.close()
    failed_file.close()


def test(filename):
    """Create book, author"""

    f = open(filename)
    # blahs = json.load(f)

    # return blahs
    i = 0
    for line in f:
        if i == 1:
            return line
        i += 1

if __name__ == "__main__":
    import server 
    from model import connect_to_db
    import os 

    app = server.Flask(__name__)

    # only run this if you want to drop DB
    os.system('dropdb books')
    os.system('createdb books')

    connect_to_db(app)
    print("connected to db.")

    crud.db.create_all()