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
                seed_file.write(str(volume_info)+'\n')

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

    for line in f:
        book_dict = json.loads(line)
        title = book_dict.get('title', None)
        pub = book_dict.get('publisher', None)
        descr = book_dict.get('description', None)
        pub_year = book_dict.get('publishedDate', None)
        pages = book_dict.get('pageCount', None)
        isbn = book_dict.get('isbn', None)
        
        # do all imageLinks have thumbnails?
        image_url = book_dict['imageLinks']['thumbnail']  
        print(f'image url: {image_url')
        tags_list = book_dict.get('categories', None)

        # clean up data
        if len(pub_year) > 4:
            pub_year = int(pub_year[:4])


        # add in adding google rating to google user
        g_rating = book_dict.get('averageRating', None)

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
            temp_book = crud.create_book(title, pub=pub, descr=descr, pub_year=pub_year, pgs=pages, isbn=isbn,author_records=author_record_list, tag_records=tags_record_list)

        
        # add_similar_tags(temp_book, os.path.basename(filename))

def test(filename):
    """Create book, author"""

    f = open(filename)
    # blahs = json.load(f)

    # return blahs

    for line in f:
        return line

if __name__ == "__main__":
    import server 
    from model import connect_to_db
    import os 

    app = server.Flask(__name__)

    os.system('dropdb books')
    os.system('createdb books')

    connect_to_db(app)
    print("connected to db.")

    crud.db.create_all()