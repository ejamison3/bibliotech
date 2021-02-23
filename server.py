"""Server for bibliotech app"""

from flask import (Flask, render_template, redirect, request, 
    jsonify, session, make_response)

from model import connect_to_db
from crud import get_user, create_user, get_similar_books_by_title
import util

from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "1123513"
app.jinja_env.undefined = StrictUndefined

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

    req = request.get_json()

    # strings are None if not considered in search
    title_string = req['titleString']
    author_string = req['authorString']
    tag_string = req['tagString']
    user_id = req['userId']   
    
    response = {
        'message': None,
        'error': None,
        'book_list': None,
        'user_id': user_id,
    }
 
    if user_id == None:
        if title_string != None:
            if author_string != None:
                if tag_string != None:
                    # title, author & tag
                    response['book_list'] = util.get_user_booklist_title_author_tag(
                        user_id,
                        title_string, 
                        author_string, 
                        tag_string)
                else:  # title and author
                    response['book_list'] = util.get_user_booklist_title_author(
                        user_id,
                        title_string, 
                        author_string)
            elif tag_string != None:
                # title and tag
                response['book_list'] = util.get_user_booklist_title_tag(
                        user_id,
                        title_string, 
                        tag_string)
            else:
                #title only 
                response['book_list'] = util.get_user_booklist_title(
                    user_id,
                    title_string)
        elif author_string != None:
            if tag_string != None:
                # author and tag
                response['book_list'] = util.get_user_booklist_author_tag(
                        user_id,
                        author_string, 
                        tag_string)
            else:
                # author only
                response['book_list'] = util.get_user_booklist_author(
                    user_id,
                    author_string)
        else:   #tag string is populated
            # tag onlyex
            response['book_list'] = util.get_user_booklist_tag(
                user_id,
                tag_string)
    else:
        if title_string != None:
            if author_string != None:
                if tag_string != None:
                    # title, author & tag
                    response['book_list'] = util.get_booklist_title_author_tag(
                        title_string, 
                        author_string, 
                        tag_string)
                else:  # title and author
                    response['book_list'] = util.get_booklist_title_author(
                        title_string, 
                        author_string)
            elif tag_string != None:
                # title and tag
                response['book_list'] = util.get_booklist_title_tag(
                        title_string, 
                        tag_string)
            else:
                #title only 
                response['book_list'] = util.get_booklist_title(title_string)
        elif author_string != None:
            if tag_string != None:
                # author and tag
                response['book_list'] = util.get_booklist_author_tag(
                        author_string, 
                        tag_string)
            else:
                # author only
                response['book_list'] = util.get_booklist_author(
                    author_string)
        else:   #tag string is populated
            # tag onlyex
            response['book_list'] = util.get_booklist_tag(tag_string)
    
    status_code = 200
    if response['book_list'] == None:
        status_code = 204
        
    return (jsonify(response), status_code)




if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)