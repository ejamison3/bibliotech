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
    print(f'UNICORNS: {username}  pwd: {pwd}')
    user = get_user(username)

    response = {
        'error': None,
        'user_id': None,
        'username': None,
    }

    if user is not None:
        # check password
        if pwd == user.password:
            response['user_id'] = user.id
            response['username'] = user.username
        else:
            response['error'] = 'Password is incorrect'
    else:
        response['error'] = 'User does not exists'

    return jsonify(response)

    # username_entered = request.form.get('username')
    # pwd_entered = request.form.get('pwd')

    # user = get_user(username_entered)

    # if user is None:
    #     # Give error message that user DNE
    #     pass
    # elif pwd_entered == user.password:
    #     # do something to log user in?
    #     session['user_key'] = user.id
    # else:
    #     # Give error that password is incorrect
    #     pass


    # return redirect('/')



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