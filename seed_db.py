"""Seed database with results from NYT Books api"""

from crud import get_author, create_author, get_book_by_title, create_book
import os


def seed_book_author(filename):
    f = open(filename)

    # each line is a book with author(s)
    for line in f:

        # order is: title|authors|publisher|description
        book_data_list = line.rstrip().split('|')

        # handle author first
        author_list = book_data_list[1].rstrip().split(',')
        author_record_list = []

        # go through each author
        for author in author_list:

            # last word is last name, all words are first name
            author_names = author.rstrip().split(' ')
            lname = author_names[-1]
            if len(author_names) > 1:
                fname = ' '.join(author_names[0:-1])
            else:
                None

            # see if author with exact lname and fname exist
            temp_author = get_author(lname, fname)

            if temp_author == None:
                temp_author = create_author(lname, fname)
            
            # save author record(s)
            author_record_list.append(temp_author)
        
        # create book if it doesn't exist yet
        title = book_data_list[0].rstrip()
        temp_book = get_book_by_title(title)

        if temp_book == None:
            if len(author_record_list) == 0:
                author_record_list = None
            create_book(title, pub=book_data_list[2], descr=book_data_list[3], author_records=author_record_list)

def seed_with_all_lists(my_path):
    file_names = os.listdir(my_path)

    for file_name in file_names:
        print(f'Now making file: {file_name}')
        seed_book_author(f'{my_path}/{file_name}')


if __name__ == "__main__":
    import server
    from model import connect_to_db

    app = server.Flask(__name__)

    connect_to_db(app)
    print("Connected to DB.")