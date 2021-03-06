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
      alert('Please select a search type');
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
    }

    // set userId if necessary
    query.userId = myBooksOnly ? prop.userId : null;
    
    //update searchQuery - call will be made in DisplaySearchResults component
    prop.setSearchQuery(query);
    prop.setIsLoading(true);
    history.push("/searchResults");
  }

  if (prop.userId === null) {
    return;
  } else{
    return (
      <div>
        <form>
          <label htmlFor="search-type"></label>
          <select id="search-type" type="dropdown">
            <option value="Title"defaultValue>Title</option>
            <option value="Author">Author Last Name</option>
            <option value="Tags">Tag</option>
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

  return (
    <div className="book">
        
      <Link to={'/book/' + id}>
        <h2>{book.title}</h2>
      </Link>
      
      {book.authors ? book.authors.map(author =>
        (<div key={author}>{author}</div>)) : ''
      }
      {book.description ? (<div><b>Description: </b>{book.description} </div>) : ''}
      {book.publisher ? (<div>Publisher: {book.publisher} </div>) : ''}
      {book.year ? (<div>Publication Year: {book.year} </div>) : ''}
      {book.tags ? (<div>Tags:
          <ul>{book.tags.map(tag =>
          (<li key={tag}>{tag}</li>))}</ul>
          </div>) : ''
      }
      {bookIsUsers ? <div>Your rating: {book.rating}</div> : <div>Average Rating: </div>}
      <span>
        {bookIsUsers ? <button onClick={removeBook}>REMOVE from my books</button> : <button onClick={addBook}>ADD to my books</button> }
      </span>
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
  // let history = useHistory();

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
      }
      response.json().then(data => {
        prop.setSearchResponse(data);
        prop.setIsLoading(false);
      })
    })
  }, [query]);

  if (prop.isLoading){
    return (
      <div>Loading...</div> 
    )
  }else{
    if (prop.searchResponse === null) {
      return (
        <div>Your search returned no books.</div>
      )
    }else{
      const bookList = prop.searchResponse.book_list;
      const books = [];
      for (let book of bookList){
        books.push(
          <div key={book.id}>
          <Book
            book={book}
          />
          </div>
        )
      }
      console.log(query.titleString)
      console.log(query)
      return (
        <div>
          <div>
            <div>Showing results for search</div>
            {query.titleString ? <li>Title: {query.titleString}</li> : ''}
            {query.authorLnameString ? <li>Author: {query.authorLnameString}</li> : ''}
            {query.tagListString ? <li>Tags: {query.tagListString}</li> : ''}
          </div>
          <div className="container">
            <React.Fragment>
              {books}
            </React.Fragment>
          </div>
        </div>
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
    const tagListString = document.getElementById('tags').value
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
            <input type="text" id="tags" name="tags"></input>
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
  let { bookId } = useParams();

  const makeEditable = () => {
    prop.setIsEditable(true);
  }

  const saveBookChanges = () => {
    //make patch request

  }

  React.useEffect(() => {
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
    });
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
    if (prop.isEditable) {
      return (
        <div>
          Editable book here
          <button onClick={saveBookChanges}>Save</button>
        </div>
      )
    } else {
      return (
        <div>
          <h2>{book.title}</h2>
          {book.authors ? book.authors.map(author =>
            (<div key={author}>{author}</div>)) : ''
          }
          {book.description ? (<div>Description: {book.description} </div>) : ''}
          {book.publisher ? (<div>Publisher: {book.publisher} </div>) : ''}
          {book.year ? (<div>Publication Year: {book.year} </div>) : ''}
          {book.tags ? (<div>Tags:
              <ul>{book.tags.map(tag =>
              (<li key={tag}>{tag}</li>))}</ul>
              </div>) : ''
          }
          <button onClick={makeEditable}>Edit Book</button>
        </div>
      )
    }
  }
}