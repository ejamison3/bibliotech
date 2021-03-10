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
        <div className="add-remove-container ">
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
          <div className="card-title text-truncate">{book.title}</div>
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

      <div className="tags">
        {book.tags ? (
          <span>{book.tags.map(tag =>
            (<Badge pill variant="info" className="tag-button"key={tag} onClick={() => searchByTag(tag)}>{tag}</Badge>))}</span>
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
        <Container className="container-small-margin justify-content-center">
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
            <input type="text" id="isbn" name="isbn" maxLength="13" placeholder="ISBN"></input>
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
  const [show, setShow] = React.useState(false)

  const handleShow = () => setShow(true);
  const handleCancel = () => setShow(false)

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

  const handleSaveRating = () => {
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;
    const query = {
      'rating': rating,
      'review': review,
      'bookId': bookId,
      'userId': prop.userId,
    }
    fetch('api/rating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    })
    .then(response => {
      // got rid of inner loop that only went to .then(data) if response populated
      return response.json()
    })
    .then(data => {
      prop.setBookResponse(data);
    })
    setShow(false)
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
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className={bookIsUsers ? "book myBook w-100" : "book w-100"}>
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

              {book.description ? (<div className="text-left book-desc"><b>Description: </b>{book.description} </div>) : ''}

              {book.publisher ? (<div className="text-left">Publisher: {book.publisher} </div>) : ''}

              {book.year ? (<div className="text-left">Publication Year: {book.year} </div>) : ''}

              {book.isbn ? (<div className="text-left">ISBN: {book.isbn}</div>) : ''}

              <Container>
                <Row>
                  <Col sm={6}>
                    <div className="tags w-100">
                      <div className="center-text">General Tags:</div>
                      {book.tags ? (
                        <span>{book.tags.map(tag =>
                          (<Badge pill variant="info" className="tag-button"key={tag}>{tag}</Badge>))}</span>
                          ) : ''
                        }
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="tags w-100">
                      <div className="center-text">Your Tags:</div>
                      {book.tags ? (
                        <span>{book.tags.map(tag =>
                          (<Badge pill variant="info" className="tag-button"key={tag}>{tag}</Badge>))}</span>
                          ) : ''
                        }
                      <div>
                        {/* update to use json to populate */}
                      <label htmlFor="tag-type"></label>
                      <select id="tag-type" type="dropdown">
                        <option value="Opt1"defaultValue>Opt1</option>
                        <option value="Opt2">Opt2</option>
                        <option value="Opt3">Opt3</option>
                        <option value="Opt4">Opt4</option>
                      </select>
                      <button>Add Tag</button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
              
              <div className="rating">Average Rating: {book.avgRating}</div>

            
              {bookIsUsers 
                ? <Container className="rating-user">
                    <Row> 
                      Your rating: {book.userScore}
                    </Row>
                    <Row className="text-left">
                      Your review: {book.userReview}
                    </Row>
                    <Row>
                      {/* MAKE THIS BUTTON OPEN A MODAL FOR EDITING */}
                      <Button onClick={handleShow}>
                        {book.userScore ? "Update rating/review" : "Add rating/review"}
                      </Button>
                    </Row>
                  </Container>
                : ''
              }
            </Col>
        </Row>
          <Modal
            show={show}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header>
              <Modal.Title>Update Rating &amp; Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Put a form here to update info
              <label htmlFor="review">New Review:
                <textarea rows="5" cols="30" id="review" name="review" placeholder="Enter your review"/>
              </label>
              <br/>
              <label htmlFor="rating">Rating: </label>
              <select id="rating" type="dropdown">
                <option value="1"defaultValue>1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </Modal.Body>
            <Modal.Footer>
              <Button className="user-button" onClick={handleSaveRating}>
                  Save - update class name
              </Button>
              <Button className="user-button" onClick={handleCancel}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      )
    }
  }
}