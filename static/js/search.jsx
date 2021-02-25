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
    history.push("/searchResults");
  }

  if (prop.userId === null) {
    return;
  }else{
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
  return (
    <div className="book">
      <h2>{prop.title}</h2>
      {prop.authorList ? prop.authorList.map(author =>
        (<div>{author}</div>)) : ''
      }
      {prop.description ? (<div>Description: {prop.description} </div>) : ''}
      {prop.publisher ? (<div>Publisher: {prop.publisher} </div>) : ''}
      {prop.year ? (<div>Publication Year: {prop.year} </div>) : ''}
      {prop.tagList ? prop.tagList.map(tag =>
        (<div>{tag}</div>)) : ''
      }
    </div>
  )

} 

const DisplaySearchResults = (prop) => {
  const query = prop.searchQuery;

  React.useEffect(() => {
    //fetch here
    fetch('api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    })
    .then(response => {
      if (response.status !== 200){
        prop.setSearchResponse(null);
      }
      response.json().then(data => {
          prop.setSearchResponse(data)
      })
    })
    // prop.setSearchResponse('blah');
  }, [query])

  console.log(query);
  console.log(prop.searchResponse);
  if (prop.searchResponse === null){
    return (
      <div>
        Your search either failed miserably because of something you did 
        or it returned no books.
      </div>
    )
  }else{
    const bookList = prop.searchResponse.book_list;
    const books = [];
    for (let book of bookList){
      books.push(
        <Book
          title={book.title}
          authorList={book.authors}
          description={book.description}
          publisher={book.publisher}
          year={book.year}
          tagList={book.tags}
        />
      )
    }
    return (
      <React.Fragment>
        {books}
      </React.Fragment>
      // <div>
        
      //   This is the search results
      //   <div>This is query: {JSON.stringify(query)}</div>
      //   <div>This is search response: {JSON.stringify(prop.searchResponse.book_list)}</div>
      // </div>
    )
  }
}