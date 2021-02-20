"""Server for bibliotech app"""

from flask import Flask, render_template, redirect, request, jsonify, session

from model import connect_to_db
from crud import get_user, create_user

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
def login_in():
    """Log In user."""

    req = request.get_json()
    print(req)

    username = req['username']
    pwd = req['pwd']
    user = get_user(username)

    response = {
        'message': None,
        'error': None,
        'user_id': None,
        'username': None,
    }

    if user is not None:
        # check password
        if pwd == user.password:
            response['user_id'] = user.id
            response['username'] = user.username
            response['message'] = 'OK'
            status_code = 200
        else:
            response['error'] = 'Password is incorrect'
            response['message'] = 'Unauthorized'
            status_code = 401
    else:
        response['error'] = 'User does not exists'
        response['message'] = 'Unauthorized'
        status_code = 401

    return (jsonify(response), status_code)


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



# @app.route('/users', methods=['POST'])
# def login():
#     """Create a new user"""

#     username = request.form.get('username')
#     password = request.form.get('password')

#     user = crud.get_user(username)

#     if user:
#         flash('Username already exists. Please log in or create different username')
#     else:
#         crud.create_user(username, password)
#         flash('Account created.')
    
#     return redirect('/')

if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)