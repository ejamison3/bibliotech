"""Server for bibliotech app"""

from flask import Flask, render_template, redirect, request, flash, session

from model import connect_to_db
import crud

from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "1123513"
app.jinja_env.undefined = StrictUndefined

@app.route('/')
def homepage():
    """View homepage."""

    # if user logged in show homepage, otherwise redirect to login screen
    return render_template('homepage.html')

@app.route('/users', methods=['POST'])
def login():
    """Create a new user"""

    username = request.form.get('username')
    password = request.form.get('password')

    user = crud.get_user(username)

    if user:
        flash('Username already exists. Please log in or create different username')
    else:
        crud.create_user(username, password)
        flash('Account created.')
    
    return redirect('/')

if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)