"use strict"

const SearchBar = (prop) => {
  let history = useHistory();
  const [onlyMyBooksChecked, setOnlyMyBooksChecked] = React.useState(false);

  const toggleCheckbox = () => {
    setOnlyMyBooksChecked(!onlyMyBooksChecked)
  }

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
    // prop.setIsEditable(false)     // in case user searches from editable screen
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
          <button className="button-search" onClick={updateQuery}>Search</button>
          <Link to={'/search/advanced'} onClick={() => {
            prop.setDisplaySearchBar(false)
            }}>
            Advanced Search</Link>
          <br/>
          <label htmlFor="only-my-books">
            Only my books
            <input id="only-my-books" type="checkbox" onClick={toggleCheckbox}/>
              {onlyMyBooksChecked 
                ? <i className="far fa-check-square"></i>
                : <i className="far fa-square"></i>
              }
          </label>
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
          <div className="text-truncate">{book.title}</div>
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
          <div>{book.tags.map(tag =>
            (<Badge pill variant="light" className="tag-button"key={tag} onClick={() => searchByTag(tag)}>{tag}</Badge>))}</div>
            ) : ''
          }
      </div>
      
      <div className="rating">
        {bookIsUsers 
          ? <div>Your rating: {book.userScore}</div> 
          : <div>Average Rating: {book.avgRating}</div>}
      </div>
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
        <Container fluid className="justify-content-center">
          <Row>
            <Col md={{span: 4, offset: 4}} className="query">
              <div className="text-center">Showing results for the following {query.searchType} query</div>
              {query.titleString ? <li>Title: {query.titleString}</li> : ''}
              {query.searchType 
                ? (query.authorFnameString 
                  ? <li>Author First Name: {query.authorFnameString}</li>
                  : '')
                  : ''
                }
              {query.authorLnameString ? <li>Author Last Name: {query.authorLnameString}</li> : ''}
              {query.tagListString ? <li>Tags: {query.tagListString}</li> : ''}
              {query.isbnString ? <li>ISBN: {query.isbnString}</li> : ''}
            </Col>
          </Row>
          <div className="books">
            <React.Fragment>
              {books}
            </React.Fragment>
          </div>
        </Container>
      );
    }  
  }
}

const AdvancedSearch = (prop) => {
  let history = useHistory();
  const [onlyMyBooksChecked, setOnlyMyBooksChecked] = React.useState(false);

  const toggleCheckbox = () => {
    setOnlyMyBooksChecked(!onlyMyBooksChecked);
  }

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
      <Form className="center">
        <Form.Group>
          <Form.Label>Title:</Form.Label>
          <Form.Control as="input" type="text" placeholder="Enter Book Title" id="title" name="title" autoFocus />
          <Form.Check className="toggle-text" type="switch" id="exactTitle" label="Exact match?" />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Author First Name:</Form.Label>
              <Form.Control as="input" type="text" id="fname" name="fname" placeholder="Author First Name" />
              <Form.Check className="toggle-text" type="switch" id="exactFname" label="Exact match?" />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>Author Last Name:</Form.Label>
              <Form.Control as="input" type="text" id="lname" name="lname" placeholder="Author Last Name" />
              <Form.Check className="toggle-text" type="switch" id="exactLname" label="Exact match?" />
            </Form.Group>
          </Col>  
        </Row>
        
        <Form.Group>
          <Form.Label>Tags</Form.Label>
          <Form.Control as="input" type="text" id="tags" name="tags" placeholder="Comma Separated Tags" />
        </Form.Group>

        <Form.Group>
          <Form.Label>ISBN</Form.Label>
          <Form.Control as="input" type="text" id="isbn" name="isbn" placeholder="ISBN" />
        </Form.Group>

        <span>
          <label className="font-weight-bold">
            Only My Books
            <input type="checkbox" id="only-my-books" name="only-my-books" onClick={toggleCheckbox} /> 
              {onlyMyBooksChecked 
                ? <i className="far fa-check-square"></i>
                : <i className="far fa-square"></i>
              }
          </label>
        </span>
            
        <button className="button-advanced-search" onClick={updateQuery}>Search</button>
      </Form>
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

  if (prop.bookResponse == null){
    return (
      <div>
        Error loading book. Please search again and select a different book.
      </div>
    )
  }else{
    const book = prop.bookResponse.book;
    const bookIsUsers = book.isUsers

    return (
      <Container className="book-big-container">
        <Row className="justify-content-center">
          <Col md={8} className={bookIsUsers ? "book-big myBook w-100" : "book-big w-100"}>
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
              <img className="book-image-big" src={book.image ? book.image : '/static/img/BookPlaceholder.png'}/>
            </div>
            <div className="authors">
              {book.authors ? book.authors.map(author =>
                (<div key={author}>{author}</div>)) : ''
              }
            </div>

            {book.description ? (<div className="text-left book-desc"><b>Description: </b>{book.description} </div>) : ''}

            {book.publisher ? (<div className="text-left w-100"><b>Publisher: </b>{book.publisher} </div>) : ''}

            {book.year ? (<div className="text-left w-100"><b>Publication Year: </b>{book.year} </div>) : ''}

            {book.isbn ? (<div className="text-left w-100"><b>ISBN: </b>{book.isbn}</div>) : ''}

            <div className="tags w-100">
              {book.tags 
                ? (<span>{book.tags.map(tag =>
                    (<Badge pill variant="info" className="tag-button"key={tag}>{tag}</Badge>))}</span>) 
                : ''
              }
            </div>
            
            <div className="rating">Average Rating: {book.avgRating}</div>

            {bookIsUsers 
              ? <Container className="rating-user">
                  {book.userScore 
                    ? (<Row className="text-left w-100"> 
                        <b>Your rating: </b> {book.userScore}
                      </Row>)
                    : ''}
                  {book.userReview 
                    ? (<Row className="text-left w-100">
                        <b>Your review: </b>{book.userReview}
                      </Row>)
                    : ''}
                  <Row>
                    <Col sm={{span: 6, offset: 3}}>
                      <button className="button-rating-add" onClick={handleShow}>
                        {book.userScore ? "Update rating/review" : "Add rating/review"}
                      </button>
                    </Col>
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
          <Modal.Header className="modal-rating-header">
            <Modal.Title className="text-center w-100">Update Rating &amp; Review</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-rating">
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
          <Modal.Footer className="modal-rating-footer w-100">
            <Container>
              <Row>
                <Col sm={3}>
                </Col>
                <Col sm={6}>
                  <Button className="modal-rating-button" onClick={handleSaveRating}>
                      Save changes
                  </Button>
                </Col>
                <Col sm={3}>
                  <Button className="modal-rating-button" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Container>
          </Modal.Footer>
        </Modal>
      </Container>
    )
  }
}