# BiblioTech

### Table of Contents
  [About BiblioTech](#about)    
    [Tech Stack](#tech)  
    [Why](#why)  
  [How to Install](#install)  
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
[Google & Amazon Seed Data](#googleAmazon)    
[New York Times Seed Data](#nyt)    
Set-up an environment and install dependencies (see requirements.txt)

BiblioTech requires a populated postgreSQL database to work as intended. There are two options for datasets which can be used as your seed data:
- Google Books & Amazon Review Data (in seed_data folder)    
  *This is the preferred seed data that illustrates full functionality*
- New York Times Best Sellers List books (in nyt_seed_process folder)   
  *Does not contain review data*

It is also possible to populate with your own seed data. The methodology used to parse and create both seed datasets is fully explained in the the appropriate repo so that can be a good starting point for your own seed data creation adventure. 

Once the database has been setup and seed data populated (see below sections for detailed steps for each dataset), the Flask web server can be started by running the server.py file. This runs the server locally on host 0.0.0.0 - if this is not the desired IP address, it can be changed at the end of the server.py file. 

### <a name="googleAmazon"></a>Google Books & Amazon Review Data
Files ready to be loaded into the database have been created and can be found in the 'seed_data' folder. 
- Google Books Data files:
  - book_seed_file_part1.json
  - book_seed_file_part2.json
  - book_seed_file_part3.json
- Amazon Review Data files
  - reviews_names.json

These files can be loaded using functions in the seed_db.py file. For safety, it is recommended that the file is run in interactive mode and then the functions run manually so that sanity checks of the database can be done after each load. **The __name__ == "__main__" condition at the end of the file contains code to drop and recreate the database. Make sure this is commented/uncommented as desired.**

If you simply want to load the Google Books & Amazon Data and create the database, do the following:
1. Run '''python3 -i seed_db.py''' 
2. In iteractive mode, run create_book_author to load the Google Books data:
    - create_book_author('seed_data/book_seed_file_part1.json')
    - create_book_author('seed_data/book_seed_file_part2.json')
    - create_book_author('seed_data/book_seed_file_part3.json')
3. Still in interactive mode, run:
    - create_user_rating('seed_data/reviews_names.json', 'rating_errors')   
      *Note rating_errors is the file that will be created containing ratings whose book does not exist in the database. This happens for approximately 1270 ratings since there are around 400 books which Google Books API was not able to find find by ISBN.*
4. Still in interactive mode, run create_average_ratings()  
    *In day to day use, average rating is updated whenever a rating is updated but for initially seeding of the database, this is done all at once at the end. If major changes are ever programmatically made to the ratings, this function can be reused to align the average rating values*
5. Exit interactive mode. The database has now been set up and seeded :)

For your convenience, the seed_data folder also contains a text file, 'seeding_instructions.txt' with some additional information such as expected number of records and how to handle errors. 

### <a name="nyt"></a>New York Best Sellers List Data 
NYT book data and the functions needed to populate the database with that data, can be found in the folder nyt_seed_process.  
  **Note, the NYT Book data does NOT contain review data or users**

1. The file nyt_db_setup.py should be run interactively and the create_initial_tags function called in order to set up the database and seed the tags folder with the tags used in the NYT data. (Alternatively, the seeding functions can be rewritten to create the tag record as needed similar to the google seeding functions)
2. The file nyt_seed_db.py should be run interactively and the seed_with_all_lists('/seed_data'). This will load all pre-created NYT seed data files which are contained in nyt_seed_process/seed_data

## <a name="search"></a> Search Functionality
BiblioTech offers both a basic search and an advanced search functionality. All searches are case insensitive.

### Basic Search Functionality
The basic search functionality allows the user to search by the following criteria:
- Title: all books whose title contains the given title keyword(s) are returned. 
- Author Last Name: all books who contain an author with the given last name are returned. Last name is defined as the last word in the author's full name. 
- Tags: books with the given tag are returned. If multiple tags (comma separated) are given as the search criteria, then all books with ANY of the tags are returned. For example, if the tag search criteria was "fiction, history" then all fiction tagged books AND all history tagged books are returned since search criteria translates to books with fiction OR books with history. 
  **Note: The sample data only provides a single tag per book but the data model is structured to support multiple tags if your dataset contains multiple.**
  - ISBN: a single book (or no books) whose ISBN matches the ISBN given is returned. The ISBN must be an exact match. 
  - Only My Books: when this box is checked, the search will only return books which the current user has added and which meet the other search criteria. If a user wishes to only see their books, they can leave the search criteria empty and simply check this box and all books they have added will be returned. 

  ### Advanced Search Functionality
  The advanced search does everything the basic search does plus more. The same broad search criteria are used (title, author, tags, ISBN) but with the following extra functionality:
  - Author First Name can be searched in addition to Author Last Name. Note that Author First Name is simply all words in the authors name except the last name (i.e., it will contain any title preceding the name and/or any middle name(s))
  - Exact Match? toggles allow the user to select whether they want to only return books whose fields match exactly their search criteria. When this is not selected, books whose fields contain the search criteria (in addition to other words) will also be included. 

## <a name="recommend"></a> Recommendations
BiblioTech offers the user a book recommendation based on what other users, who have rated at least one book in common with the current user, have rated. 

## <a name=future></a> Future Work
The following improvements and enhancements may be explored in the future:
- Improve seed dataset so that there is book data for ALL included reviews
- Allow users to add Tags to their books
- Add additional fuzzy search methodologies such as perhaps Levenshtein Distance for authors or titles to allow for typos, or soundex for author names to allow for mispellings. 
- Improve book recommendations so that only books from users with similar preferences (i.e., similar ratings for some books) are recommended. This will be done by calculating Pearson Correlation for each user. Alternatively, it could be done with a Pearson Correlation for books as well or a combo of the two.  

## <a name="resources"></a> Resources
Amazon review data comes from this data set:
- **Justifying recommendations using distantly-labeled reviews and fined-grained aspects** Jianmo Ni, Jiacheng Li, Julian McAuley  *Empirical Methods in Natural Language Processing* (EMNLP), 2019

This dataset can be found [here](https://nijianmo.github.io/amazon/index.html)