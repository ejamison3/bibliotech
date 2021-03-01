"""Server for bibliotech app"""

from flask import (Flask, render_template, redirect, request, 
    jsonify, session, make_response)

from model import connect_to_db
from crud import *

import util

from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "1123513"
app.jinja_env.undefined = StrictUndefined

# find wildcard to make reload always take you home
@app.route('/')
def homepage():
    """View homepage."""

    # if user logged in show homepage, otherwise redirect to login screen
    return render_template('index.html')


@app.route('/userLogin', methods=['POST'])
def login():
    """Log In user."""

    req = request.get_json()

    username = req['username']
    pwd = req['pwd']

    user = get_user(username)

    login_resp = {
        'message': None,
        'error': None,
        'user_id': None,
        'username': None,
    }

    user_id = None
    username = None

    if user is not None:
        # check password
        if pwd == user.password:
            login_resp['user_id'] = user.id
            login_resp['username'] = user.username
            login_resp['message'] = 'OK'
            status_code = 200
            user_id = str(user.id)
            username = user.username
        else:
            login_resp['error'] = 'Password is incorrect'
            login_resp['message'] = 'Unauthorized'
            status_code = 401
    else:
        login_resp['error'] = 'User does not exists'
        login_resp['message'] = 'Unauthorized'
        status_code = 401

    resp = make_response(jsonify(login_resp), status_code)
    resp.set_cookie('user_id', user_id)
    resp.set_cookie('username', username)
    return resp


@app.route('/createAccount', methods=['POST'])
def create_account():
    """Create Account"""

    req = request.get_json()
    print(req)

    username = req['username']
    pwd = req['pwd']
    pwd_dup = req['pwdDup']

    # see if user exists
    user = get_user(username)

    response = {
        'message': None,
        'error': None,
        'user_id': None,
        'username': None,
    }

    if user is None:
        # check password
        if pwd == pwd_dup:
            # create user, if successful
            user = create_user(username, pwd)
            if user is not None:
                response['message'] = 'OK'
                status_code = 200
            else:
                response['message'] = 'Could not create new user'
                status_code = 422
        else:
            response['error'] = 'Password is inconsistent'
            response['message'] = 'Unauthorized'
            status_code = 401
    else:
        response['error'] = 'User already exists'
        response['message'] = 'Unauthorized'
        status_code = 422

    return (jsonify(response), status_code)


@app.route('/api/search', methods=['POST'])
def perform_search():
    """Perform simple search and return results as list"""

    # needed to return which books belong to user (if not requesting only their books)
    try:
        logged_in_user_id = request.cookies["user_id"]
    except:
        logged_in_user_id = 1    # for testing from postman

    req = request.get_json()

    # strings are None if not considered in search
    title_string = req['titleString']
    author_lname_string = req['authorLnameString']
    tag_string = req['tagListString']       # comma separated string of tags
    search_type = req['searchType']         # advanced, basic
    user_id = req['userId']
    

    tag_list = util.string_to_list(tag_string) if tag_string != None else None
    
    response = {
        'message': None,
        'error': None,
        'book_list': None,
        'user_id': user_id,
    }
 
    # if advanced search, get fuzzy/exact search booleans 
    if search_type == 'advanced':
        # extra fields for advanced search
        author_fname_string = req['authorFnameString']

        # search specifiers (fuzzy/exact)
        exact_title = req['exactTitle']
        exact_fname = req['exactFname']
        exact_lname = req['exactLname']
    
        books = get_books_by_various_advanced(title=title_string, 
                                            author_fname=author_fname_string,
                                            author_lname=author_lname_string, 
                                            tag_list=tag_list, 
                                            user_id=user_id,
                                            exact_title=exact_title,
                                            exact_fname=exact_fname,
                                            exact_lname=exact_lname)
    # basic search
    else:
        books = get_books_by_various(title=title_string, 
                                    author_lname=author_lname_string, 
                                    tag_list=tag_list, 
                                    user_id=user_id)

    response['book_list'] = util.books_to_dictionary(books, logged_in_user_id)
    
    status_code = 200
    if response['book_list'] == []:
        status_code = 204 
        

    return (jsonify(response), status_code)


@app.route('/book/<bookId>')
def get_book(bookId):
    """Get single book data to populate /book/{id} page"""

    book_id = bookId

    response = {
        'message': None,
        'error': None,
        'book': None,
    }

    book = get_book_by_id(book_id)
    print(f'book: {book}')

    if book != None:
        response['book'] = util.book_to_dictionary(book)

    status_code = 204 if book == None else 200

    print(f'json reponse: {response}')

    return (jsonify(response), status_code)
    

@app.route('book/user/<bookId>/<userId>', methods=['DELETE','PATCH'])
def delete_add_book_user(bookId, userId):
    """Add or remove a user from a specific book"""

    book_id = bookId
    userId = userId

    if request.method == 'DELETE':
        pass
    elif request.method == 'PATCH':
        pass




if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)