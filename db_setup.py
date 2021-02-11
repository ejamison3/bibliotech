"""Setup of tags and categories tables"""

from model import db, Tag, Category, connect_to_db

tags_list = {
    'action',
    'adventure',
    'history',
    'art',    
    'architecture',
    'biography',
    'anthology',
    'chick lit',
    'children',
    'sci-fi',
}

# when adding values, update enum in Category class definition
categories_list = {
    'fiction', 
    'reference',
}

def create_tags():
    """creates all records in the tags table"""

    for tag in tags_list:
        temp_tag = Tag(tag_name=tag)
        db.session.add(temp_tag)
    
    db.session.commit()


def create_categories():
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