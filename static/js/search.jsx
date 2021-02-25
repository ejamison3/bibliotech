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
        return(
          <div>
            No books found, try again
          </div>
        )
      }
      response.json().then(data => {
        return(
          <div>
            Valid response maybe?
          </div>
        )
      })
    })
    prop.setSearchResponse('blah');
  }, [query])

  console.log(query);
  console.log(prop.searchResponse);
  return (
    <div>
      This is the search results
      <div>This is query: {JSON.stringify(query)}</div>
      <div>This is search response: </div>
    </div>
  )
}