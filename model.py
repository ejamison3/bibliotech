"""Create database"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Book(db.Model):
    """Data model for a book"""

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
    
    def __repr__(self):
        return f'<Book id={self.id} title={self.title}'  # should I include more attributes?


class Author(db.Model):
    """Data model for an author"""

    __tablename__ = "authors"

    id = db.Column(db.Integer, 
                   primary_key=True,
                   autoincrement=True)
    fname = db.Column(db.String(50))    # not everyone has a first name
    lname = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Author id={self.id} lname={self.lname}'


class Book_Author(db.Model):
    """Data model for Book and Author join table"""

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
    """Data model for categories"""

    __tablename__ = "categories"

    id = db.Column(db.Integer,
                   primary_key=True,
                   autoincrement=True)
    category = db.Column(db.Enum('fiction', 'reference', name="book_categories"))    # What does name mean? 

    def __repr__(self):
        return f'<Category id={self.id} category={self.category}>'

