"""Create database"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Book(db.Model):
    """Data model for Book"""

    __tablename__ = "books"

    id = db.Column(db.Integer, 
                   primary_key=True,
                   autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    publisher = db.Column(db.String(50))
    publication_year = db.Column(db.Integer)    # can this be limited to 4 ints?
    pages = db.Column(db.Integer)  
    avg_rating = db.Column(db.Integer)
    category_id = db.Column(db.Integer, 
                            db.ForeignKey('categories.id'),
                            nullable=False) 
    
    # create relationships
    # association table relationships
    authors = db.relationship("Author",
                              secondary="books_authors",
                              backref="books")
    tags = db.relationship("Tag",
                           secondary="books_tags",
                           backref="books")
    users = db.relationship("User",
                            secondary="users_books",
                            backref="books")

    # middle table relationships
    ratings = db.relationship("Rating")

    # many to one relationship
    category = db.relationship("Category",
                               backref="books")
    
    def __repr__(self):
        return f'<Book id={self.id} title={self.title}'  # should I include more attributes?


class Author(db.Model):
    """Data model for Author"""

    __tablename__ = "authors"

    id = db.Column(db.Integer, 
                   primary_key=True,
                   autoincrement=True)
    fname = db.Column(db.String(50))    # not everyone has a first name
    lname = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Author id={self.id} lname={self.lname}'


class BookAuthor(db.Model):
    """Data model for Book and Author association table"""

    __tablename__ = "books_authors"

    id = db.Column(db.Integer,
                   primary_key=True,
                   autoincrement=True)
    book_id = db.Column(db.Integer,
                        db.ForeignKey('books.id'),
                        nullable=True)
    author_id = db.Column(db.Integer,
                          db.ForeignKey('authors.id'),
                          nullable=True)
    
    def __repr__(self):
        return f'<Book_Author id={self.id} book_id={self.book_id} author_id={self.author_id}>'


class Category(db.Model):
    """Data model for Category"""

    __tablename__ = "categories"

    id = db.Column(db.Integer,
                   primary_key=True,
                   autoincrement=True)
    category_name = db.Column(db.Enum('fiction', 'reference', name="book_categories"), nullable=False)    # What does name mean? 

    # backref on books allows accessing related books via 'books' term

    def __repr__(self):
        return f'<Category id={self.id} category={self.category_name}>'

class Tag(db.Model):
    """Data model for Tag"""

    __tablename__ = "tags"

    id = db.Column(db.Integer,
                   primary_key=True,
                   autoincrement=True)
    tag_name = db.Column(db.Enum('sci-fiction', 'fantasy', 'python', 'reference', name="tag_values"), 
                         nullable=False)   # can this be defined in a variable and then put in here?
    
    def __repr__(self):
        return f'<Tag id={self.id} tag_name={self.tag_name}>'


class BookTag(db.Model):
    """Data model for Tag and Book association table"""

    __tablename__ = "books_tags"

    id = db.Column(db.Integer,
                   primary_key=True,
                   autoincrement=True)
    book_id = db.Column(db.Integer,
                       db.ForeignKey('books.id'),
                       nullable=False)
    tag_id = db.Column(db.Integer,
                       db.ForeignKey('tags.id'),
                       nullable=False)
    user_id = db.Column(db.Integer,
                       db.ForeignKey('users.id'),
                       nullable=False)
    
    def __repr__(self):
        return (
            f'<BookTag id={self.id} ' 
            f'book_id={self.book_id} '
            f'tag_id={self.tag_id} '
            f'tag_id={self.user_id} '
        )


class User(db.Model):
    """Data model for User"""

    __tablename__ = "users"

    id = db.Column(db.Integer,
                   primary_key=True,
                   autoincrement=True)
    username = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(30), nullable=False)  

    # backref books on Book allows access to user books using 'books' term

    # middle table relationship
    ratings = db.relationship("Rating")

    def __repr__(self):
        return f'<User id={self.id} username={self.username}'


class UserBook(db.Model):
    """Data model for User and Book association table"""

    __tablename__ = "users_books"

    id = db.Column(db.Integer,
                   primary_key=True,
                   autoincrement=True)
    user_id = db.Column(db.Integer,
                        db.ForeignKey('users.id'),
                        nullable=False)
    book_id = db.Column(db.Integer,
                        db.ForeignKey('books.id'),
                        nullable=False)
    has_read = db.Column(db.Boolean,
                         default=False,
                         nullable=False)        # make sure default syntax is correct

    # relationships
    book = db.relationship("Book")
    user = db.relationship("User")
    
    def __repr__(self):
        return f'<UserBook id={self.id} user_id={self.user_id} book_id={self.book_id}'

class Rating(db.Model):
    """Data model for Rating table - middle table between User and Book tables"""

    __tablename__ = "ratings"

    id = db.Column(db.Integer, 
                   primary_key=True,
                   autoincrement=True)
    score = db.Column(db.Enum('1', '2', '3', '4', '5', name="rating_scores"), nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer,
                        db.ForeignKey('users.id'),
                        nullable=False)
    book_id = db.Column(db.Integer,
                        db.ForeignKey('books.id'),
                        nullable=False)

    def __repr__(self):
        return (
            f'Rating id={self.id} score={self.score} '
            f'user_id={self.user_id} book_id={self.book_id}'
        )

def connect_to_db(app):
    """Connect the database to our Flask app"""

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres:///books'   # if running on a different port, then 'postgres://localhost:5433/books'
    app.config['SQLQLCHEMY_ECHO'] = False
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)

###################################################
# For Testing #

if __name__ == "__main__":
    import server

    app = server.Flask(__name__)

    connect_to_db(app)
    print("Connected to DB.")

    db.create_all()
    
