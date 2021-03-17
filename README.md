# BiblioTech

### Table of Contents
  [About BiblioTech](#about)    
    [Tech Stack](#tech)  
    [Why](#why)  
  [How to Install](#install)  
  [Data](#data)  
  [Search Functionality](#search)  
  [Recommendations](#recommend)  
  [Future Work](#future)
  [Resources](#resources)  

## <a name="about"></a>About BiblioTech
[Tech Stack](#tech)
[Why](#why)  
BiblioTech is a single page web app (SPWA) that allows users to search, rate, and track books as well as get book recommendations.  

### <a name="tech"></a>Tech Stack
BiblioTech's backend was built in Python using the Flask web framework and SQLAlchemy as the ORM to interact with the PostgreSQL database.
The frontend was built using JavaScript with React as the web framework. React function components (as opposed to classes) are used in conjunction with hooks. 
The front end has been stylized using a combination of vanilla CSS and React-Bootstrap.

### <a name="why"></a>Why BiblioTech?
Initially motivated by a desire to build a digital catalog of my physical books, BiblioTech has evolved to allow me to play with some of my favorite "problems" - searches and recommendations. I have begun to explored these "problems" by  providing enhanced search functionality and a recommendation engine. 

## <a name="install"></a> How to Install
Set-up an environment and install dependencies (see requirements.txt)

BiblioTech requires a populated postgreSQL database to work as intended. There are two options for datasets which can be used as your seed data:
- Google Books & Amazon Review Data (in seed_data folder)    
  *This is the preferred seed data that illustrates full functionality*
- New York Times Best Sellers List books (in nyt_seed_process folder)   
  *Does not contain review data*

It is also possible to populate with your own seed data. The methodology used to parse and create both seed datasets is fully explained in the the appropriate repo so that can be a good starting point for your own seed data creation adventure. 

Once the database has been setup and seed data populated (see below sections for detailed steps for each dataset), the Flask web server can be started by running the server.py file. This runs the server locally on host 0.0.0.0 - if this is not the desired IP address, it can be changed at the end of the server.py file. 

### Google Books & Amazon Review Data
Files ready to be loaded into the database have been created and can be found in the 'seed_data' folder. 
- Google Books Data files:
  - book_seed_file_part1.json
  - book_seed_file_part2.json
  - book_seed_file_part3.json
- Amazon Review Data files
  - reviews_names.json

These files can be loaded using functions in the seed_db.py file. For safety, it is recommended that the file is run in interactive mode and then the functions run manually so that sanity checks of the database can be done after each load. **The __name__ == "__main__" condition at the end of the file contains code to drop and recreate the database. Make sure this is commented/uncommented as desired.**

If you simply want to load the Google Books & Amazon Data and create the database, do the following:
1. Run '''python3 -i seed_db.py'''' 
2. In iteractive mode, run create_book_author to load the Google Books data:
    - create_book_author(('seed_data/book_seed_file_part1.json')
    - create_book_author(('seed_data/book_seed_file_part2.json')
    - create_book_author(('seed_data/book_seed_file_part3.json')
3. Still in interactive mode, run:
    - create_user_rating('seed_data/reviews_names.json', 'rating_errors')   
      *Note rating_errors is the file that will be created containing ratings whose book does not exist in the database. This happens for approximately 1270 ratings since there are around 400 books which Google Books API was not able to find find by ISBN.*
4. Still in interactive mode, run create_average_ratings()  
    *In day to day use, average rating is updated whenever a rating is updated but for initially seeding of the database, this is done all at once at the end. If major changes are ever programmatically made to the ratings, this function can be reused to align the average rating values*
5. Exit interactive mode. The database has now been set up and seeded :)

For your convenience, the seed_data folder also contains a text file, 'seeding_instructions.txt' with some additional information such as expected number of records and how to handle errors. 

### New York Best Sellers List Data 
NYT book data and the functions needed to populate the database with that data, can be found in the folder nyt_seed_process. **Note, the NYT Book data does NOT contain review data or users**

The file nyt_db_setup.py should be run interactively and the create_initial_tags function called in order to set up the database and seed the tags folder with the tags used in the NYT data. (Alternatively, the seeding functions can be rewritten to create the tag record as needed similar to the google seeding functions)

## <a name="data"></a> Data
[Amazon Reviews](#reviewData)
[Google Books](#googleData)
[New York Times Data](#nytData)

Stuff about seeding data

### <a name="reviewData"></a>Amazon Review Data


### <a name="googleData"></a>Google Books Data

### <a name="nytData"></a>New York Times Bestseller List Data

## <a name="search"></a> Search Functionality

## <a name="recommend"></a> Recommendations

## <a name=future></a> Future Work
The following improvements and enhancements may be explored in the future:
- Improve seed dataset so that there is book data for ALL included reviews

## <a name="resources"></a> Resources
Amazon review data comes from this data  set: