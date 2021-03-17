"""Setup of tags and categories tables"""

from model import db, Tag, connect_to_db

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

def create_initial_tags():
    """creates all records in the tags table"""

    for tag in tags_list:
        temp_tag = Tag(tag_name=tag)
        db.session.add(temp_tag)
    
    db.session.commit()


if __name__ == "__main__":
    from server import app
    import os

    # only run if you want to drop DB
    # os.system('dropdb books')
    # os.system('createdb books')

    connect_to_db(app)
    print("Connected to DB.")

    db.create_all()

    # create_tags()