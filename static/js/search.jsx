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
      'titleString': null,
      'authorString': null,
      'tagListString': null,
      'userId': null,
    }

    //set appropriate search string in query object
    switch (searchType) {
      case 'Title':
        query.titleString = searchVal;
        break;
      case 'Author':
        query.authorString = searchVal;
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
  let id = prop.id;
  return (
     <div className="book">
      <Link to={'/book/' + id}>
        <h2>{prop.title}</h2>
      </Link>
      
      {prop.authorList ? prop.authorList.map(author =>
        (<div key={author}>{author}</div>)) : ''
      }
      {prop.description ? (<div>Description: {prop.description} </div>) : ''}
      {prop.publisher ? (<div>Publisher: {prop.publisher} </div>) : ''}
      {prop.year ? (<div>Publication Year: {prop.year} </div>) : ''}
      {prop.tagList ? (<div>Tags:
          <ul>{prop.tagList.map(tag =>
          (<li key={tag}>{tag}</li>))}</ul>
          </div>) : ''
      }
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

  //is it appopriate to put BELOW in a useEffect with searchResponse. I feel like it could have some weird side effects
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
            id={book.id}
            title={book.title}
            authorList={book.authors}
            description={book.description}
            publisher={book.publisher}
            year={book.year}
            tagList={book.tags}
          />
          </div>
        )
      }
      return (
        <div>
          Put query here
          <React.Fragment>
            {books}
          </React.Fragment>
        </div>
      );
    }  
  }
}

const DisplayBook = (prop) => {
  let { bookId } = useParams();

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
    // const book = prop.bookSearchResponse.book;
    // console.log('BOOOOOOOOOKKKKKKK: ' + book);
    return (
      <div>
        Here is where book info will be displayed { bookId }
      </div>
    )
  }
}