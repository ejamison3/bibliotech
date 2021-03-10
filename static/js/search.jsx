"use strict"

const SearchBar = (prop) => {
  let history = useHistory();

  const updateQuery = (evt) => {
    evt.preventDefault();

    //get values to send in fetch request
    const searchType = document.getElementById('search-type').value;
    const myBooksOnly = document.getElementById('only-my-books').checked;
    const searchVal = document.getElementById('search-field').value;

    if (searchType == null){
      <Alert variant="danger">Please select a search type!</Alert>
      return;
    }

    if (searchVal == '') {
      const continueSearch = confirm('Are you sure you want to return all ' + (myBooksOnly ? 'of your ': '') + 
        'books? \n This search can be time consuming.');
      if (continueSearch == false){
        return;
      }
    }

    //create empty structure
    let query = {
      'searchType': 'basic',
      'titleString': null,
      'authorLnameString': null,
      'tagListString': null,
      'isbnString': null,
      'userId': null,
    }

    //set appropriate search string in query object
    switch (searchType) {
      case 'Title':
        query.titleString = searchVal;
        break;
      case 'Author':
        query.authorLnameString = searchVal;
        break;
      case 'Tags':
        query.tagListString = searchVal;
        break;
      case 'ISBN':
        query.isbnString = searchVal;
    }

    // set userId if necessary
    query.userId = myBooksOnly ? prop.userId : null;
    
    //update searchQuery - call will be made in DisplaySearchResults component
    prop.setIsEditable(false)     // in case user searches from editable screen
    prop.setSearchQuery(query);
    prop.setIsLoading(true);
    history.push("/searchResults");
  }

  if (prop.userId === null) {
    return;
  } else{
    return (
      <div className="search">
        <form>
          <label htmlFor="search-type"></label>
          <select id="search-type" type="dropdown">
            <option value="Title"defaultValue>Title</option>
            <option value="Author">Author Last Name</option>
            <option value="Tags">Tag</option>
            <option value="ISBN">ISBN</option>
          </select>
          <label htmlFor="search-field"></label>
          <input id="search-field" type="text" placeholder="Type search phrase" autoFocus/>
          <button onClick={updateQuery}>Search</button>
          <Link to={'/search/advanced'} onClick={() => {
            prop.setDisplaySearchBar(false)
            }}>
            Advanced Search</Link>
          <br/>
          <label className="toggle-off-label">All Books</label>
          <label className="toggle" >
            <input id="only-my-books" type="checkbox"/>
            <span className="slider"/>
          </label>
          <label className="toggle-on-label">Only my books</label>
          <br/>
        </form>
      </div>
    )
  }
}

const Book = (prop) => {
  const [bookIsUsers, setBookIsUsers] = React.useState(prop.book.isUsers)

  const book = prop.book;
  const id = book.id;
  let history = useHistory();

  const removeBook = () => {
    
    fetch('/user/' + id + '/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      return response.json()
    })
    .then(data => {
      book.isUsers = false;
      setBookIsUsers(false)
    })
  }

  const addBook = () => {
    
    fetch('/user/' + id + '/add', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      return response.json()
    })
    .then(data => {
      book.isUsers = true;
      setBookIsUsers(true)
    })
  }

  const searchByTag = (curr_tag) => {
    // update query in state to search by tag clicked
    let query = {
      'searchType': 'basic',
      'titleString': null,
      'authorLnameString': null,
      'tagListString': curr_tag,
      'isbnString': null,
      'userId': null,
    }
    // go to DisplaySearchResults which does actual post call to search (do this using history)
    prop.setSearchQuery(query);
    prop.setIsLoading(true);
    history.push("/searchResults");
  }

  return (
    <div className={bookIsUsers ? "myBook book" : "book"} style={{width: '100%'}}>

      <div style={{width: '100%'}}>
        {/* add class name */}
        {/* add-remove-container */}
        <div className="card-header">
          {bookIsUsers 
            ? (<label className="remove-book">
                Remove Book
                <button className="book-add-remove" onClick={removeBook}>
                  <i className="fas fa-minus"></i>
                </button>
              </label>) 
            : <label>
                Add Book
                <button className="book-add-remove" onClick={addBook}>
                  <i className="fas fa-plus"></i>
                </button> 
              </label>
          }
        </div>
        <Link className="title" to={'/book/' + id}>
          <h4 className="card-title text-truncate">{book.title}</h4>
        </Link>
        <Link className="books-image" to={'/book/' + id}>
          <img src={book.image ? book.image : '/static/img/BookPlaceholder.png'}/>
        </Link>
        <div className="authors">
          {book.authors ? book.authors.map(author =>
            (<div key={author}>{author}</div>)) : ''
          }
        </div>
      </div>

        {/* use badge will pill modifier class */}
        {/* removed class tags */}
      <div className="card-footer">
        {book.tags ? (
          <span>{book.tags.map(tag =>
            (<button className="tag-button"key={tag} onClick={() => searchByTag(tag)}>{tag}</button>))}</span>
            ) : ''
          }
      </div>
      
      <div className="rating">
        {bookIsUsers ? <div>Your rating: {book.userScore}</div> : <div>Average Rating: {book.avgRating}</div>}
      </div>
    </div>
  )
} 

const EditBook = (prop) => {
  return (
    <div>
      Edit Book
    </div>
  )
}

const DisplaySearchResults = (prop) => {
  const query = prop.searchQuery;
  
  React.useEffect(() => {
    fetch('api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    })
    .then(response => {
      if (!response.ok){
        console.log('Some sorty of error has occurred');
        prop.setSearchResponse(0);
        prop.setIsLoading(false);
      }else if (response.status === 204) {
        prop.setSearchResponse(null);
        prop.setIsLoading(false);
      }else{
      response.json().then(data => {
        prop.setSearchResponse(data);
        prop.setIsLoading(false);
      })
    }
    })
  }, [query]);

  if (prop.isLoading){
    return (
      <div className="center-text">
        <Spinner animation="border" variant="light" role="status" size="lg">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    )
  }else{
    if (prop.searchResponse === null) {
      return (
        <div className="center-text">
          Your search returned no books.
        </div>
      )
    }else{
      const bookList = prop.searchResponse.book_list;
      const books = [];
      for (let book of bookList){
        books.push(
          <Card key={book.id} className="w-100">
            <Book
              book={book}
              searchQuery={prop.searchQuery}
              setSearchQuery={prop.setSearchQuery}
              isLoading={prop.isLoading}
              setIsLoading={prop.setIsLoading}
            />
          </Card>
        )
      }
      return (
        <Container className="container-small-margin">
          <div>
            <div>Showing results for search</div>
            {query.titleString ? <li>Title: {query.titleString}</li> : ''}
            {query.authorLnameString ? <li>Author: {query.authorLnameString}</li> : ''}
            {query.tagListString ? <li>Tags: {query.tagListString}</li> : ''}
          </div>
          {/* <div className="books"> */}
          <div className="books">
            <React.Fragment>
            {/* <Col className="container-fluid mt-4"> */}
              {books}
            </React.Fragment>
          </div>
          {/* </div> */}
        </Container>
      );
    }  
  }
}

const AdvancedSearch = (prop) => {
  let history = useHistory();

  const updateQuery = (evt) => {
    evt.preventDefault();

    //get values to send in fetch request
    //Title
    const titleString = document.getElementById('title').value;
    const exactTitle = document.getElementById('exactTitle').checked; 
    // Author
    const authorFnameString = document.getElementById('fname').value;
    const exactFname = document.getElementById('exactFname').checked;
    const authorLnameString = document.getElementById('lname').value;
    const exactLname = document.getElementById('exactLname').checked;
    //Tags
    const tagListString = document.getElementById('tags').value;
    const isbnString = document.getElementById('isbn').value;
    //User
    const myBooksOnly = document.getElementById('only-my-books').checked;

    //warning alert if no search criteria
    if (!titleString && !authorFnameString && !authorLnameString && !tagListString){
      const continueSearch = confirm('Are you sure you want to return all ' + (myBooksOnly ? 'of your ': '') + 
        'books? \n This search can be time consuming.');
      if (continueSearch == false){
        return;
      }
    }

    //create & define query structure
    let query = {
      'searchType': 'advanced',
      'titleString': (titleString != '' ? titleString : null),
      'exactTitle': exactTitle,
      'authorFnameString': (authorFnameString != '' ? authorFnameString : null),
      'exactFname': exactFname,
      'authorLnameString': (authorLnameString != '' ? authorLnameString : null),
      'exactLname': exactLname,
      'tagListString': (tagListString != '' ? tagListString : null),
      'isbnString': isbnString,
      'userId': null,
    }

    //set values in query
    // query.titleString = titleString != '' ? titleString : null;
    // set userId if necessary
    query.userId = myBooksOnly ? prop.userId : null;

    prop.setSearchQuery(query);
    prop.setIsLoading(true);
    prop.setDisplaySearchBar(true)
    history.push("/searchResults")

  }

  return (
    <div>
      <h2 className="center-text">Advanced Search</h2>
      <form className="center">
        <label htmlFor="title"> Title
          <input type="text" id="title" name="title" autoFocus></input>
        </label>
        <label htmlFor="exactTitle">Exact match?
          <input type="checkbox" id="exactTitle" name="exactTitle"/>
        </label>
        <br/>
        <div>
          Author:
          <label htmlFor="fname">
            <input type="text" 
                  id="fname" 
                  name="fname" 
                  placeholder="Author First Name">
            </input>
          </label>
          <label htmlFor="exactFname">Exact match?
            <input type="checkbox" id="exactFname" name="exactFname"/>
          </label>
          <br/>
          <label htmlFor="lname">
            <input type="text" 
                  id="lname" 
                  name="lname" 
                  placeholder="Author Last Name">
            </input>
          </label>
          <label htmlFor="exactLname">Exact match?
            <input type="checkbox" id="exactLname" name="exactLname"/>
          </label>
        </div>
        <div>
          Tags:
          <label htmlFor="tags">
            <input type="text" id="tags" name="tags" placeholder="comma separated tags"></input>
          </label>
        </div>
        <div>
          ISBN:
          <label htmlFor="isbn">
            <input type="text" id="isbn" name="isbn" maxlength="13" placeholder="ISBN"></input>
          </label>
        </div>
        <div>
          <label htmlFor="only-my-books">Only My Books
            <input type="checkbox" id="only-my-books" name="only-my-books"></input>
          </label>
        </div>
        <button onClick={updateQuery}>Search</button>
      </form>
    </div>
  )
}

const DisplayBook = (prop) => {
  // const [bookIsUsers, setBookIsUsers] = React.useState(true)
  let { bookId } = useParams();

  // figure out bookIsUsers set in state in Book component. Need variable value here too...

  const makeEditable = () => {
    prop.setIsEditable(true);
  }

  const updateBook = () => {
    // prop.setIsLoading(true);
    fetch('/book/' + bookId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      // got rid of inner loop that only went to .then(data) if response populated
      return response.json()
    })
    .then(data => {
      prop.setBookResponse(data);
    })
  }

  const saveBookChanges = () => {
    //make patch request

  }

  const removeBook = () => {
    
    fetch('/user/' + bookId + '/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      return response.json()
    })
    .then(data => {
      updateBook()
    })
  }

  const addBook = () => {
    
    fetch('/user/' + bookId + '/add', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      return response.json()
    })
    .then(data => {
      updateBook()
    })
  }

  React.useEffect(() => {
    updateBook()
  }, []);

  // was using isLoading but then would never rerender once loaded. Not sure on best practices
  if (prop.bookResponse == null){
    return (
      <div>
        Error loading book. Please search again and select a different book.
      </div>
    )
  }else{
    const book = prop.bookResponse.book;
    const bookIsUsers = book.isUsers
    if (prop.isEditable) {
      return (
        <div>
          Editable book here
          <button onClick={saveBookChanges}>Save</button>
        </div>
      )
    } else {
      // id = book.id
      return (
        <div className={bookIsUsers ? "book myBook" : "book"} style={{width: '100%'}}>
          <div style={{width: '100%'}}>
            {/* add class name */}
            <div className="add-remove-container">
              {bookIsUsers 
                ? (<label className="remove-book">
                    Remove Book
                    <button className="book-add-remove" onClick={removeBook}>
                      <i className="fas fa-minus"></i>
                    </button>
                  </label>) 
                : <label>
                    Add Book
                    <button className="book-add-remove" onClick={addBook}>
                      <i className="fas fa-plus"></i>
                    </button> 
                  </label>
              }
            </div>
            <div className="title">
              {book.title}
            </div>
            <div>
              <img src={book.image ? book.image : '/static/img/BookPlaceholder.png'}/>
            </div>
            <div className="authors">
              {book.authors ? book.authors.map(author =>
                (<div key={author}>{author}</div>)) : ''
              }
            </div>
          </div>

          <div className="tags">
            {book.tags ? (
                <span>{book.tags.map(tag =>
                (<button className="tag-button"key={tag} onClick={() => searchByTag(tag)}>{tag}</button>))}</span>
                ) : ''
            }
          </div>
          
          <div className="rating">
            {bookIsUsers ? <div>Your rating: {book.userScore}</div> : <div>Average Rating: {book.avgRating}</div>}
          </div>
          <div>
            <button onClick={makeEditable}>Edit Book</button>
          </div>
        </div>
        // <div>
        //   <h2>{book.title}</h2>
        //   {book.image ? (<img src={book.image}/>) : ''}
        //   {book.authors ? book.authors.map(author =>
        //     (<div key={author}>{author}</div>)) : ''
        //   }
        //   {book.description ? (<div><b>Description: </b>{book.description} </div>) : ''}
        //   {book.publisher ? (<div>Publisher: {book.publisher} </div>) : ''}
        //   {book.year ? (<div>Publication Year: {book.year} </div>) : ''}
        //   {book.isbn ? (<div>ISBN: {book.isbn}</div>) : ''}
        //   {book.tags ? (<div>Tags:
        //       <ul>{book.tags.map(tag =>
        //       (<li key={tag}>{tag}</li>))}</ul>
        //       </div>) : ''
        //   }
          
        //   {/* {bookIsUsers ? <div>Your rating: {book.rating}</div> : <div>Average Rating: </div>} */}
        //   {/* <span>
        //     {bookIsUsers ? <button onClick={removeBook}>REMOVE from my books</button> : <button onClick={addBook}>ADD to my books</button> }
        //   </span> */}
        //   <button onClick={makeEditable}>Edit Book</button>
        // </div>
      )
    }
  }
}