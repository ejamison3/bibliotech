"""Setup of tags and categories tables"""

from model import db, Tag, Category, connect_to_db

tags_list = {
    'advice',
    'animals',
    'audio',
    'fiction',
    'non-fiction',
    'celebrities',
    'chapter-books',
    'childrens',
    'print',
    'e-book',
    'crime',
    'espionage',
    'expedition',
    'family',
    'food',
    'fitness',
    'games',
    'hardcover',
    'business',
    'graphic',
    'political',
    'health',
    'humor',
    'manga',
    'mass-market',
    'civil-rights',
    'indigenous',
    'paperback',
    'picture-book',
    'relationships',
    'series',
    'travel',
    'young-adult',
}

# when adding values, update enum in Category class definition
categories_list = {
    'fiction',
    'non-fiction',
    'reference',
}

def create_initial_tags():
    """creates all records in the tags table"""

    for tag in tags_list:
        temp_tag = Tag(tag_name=tag)
        db.session.add(temp_tag)
    
    db.session.commit()


def create_initial_categories():
    """creates all records in the categories table"""

    for category in categories_list:
        temp_category = Category(category_name=category)
        db.session.add(temp_category)
    
    db.session.commit()


if __name__ == "__main__":
    from server import app
    import os

    os.system('dropdb books')
    os.system('createdb books')

    connect_to_db(app)
    print("Connected to DB.")

    db.create_all()

    create_categories()
    create_tags()