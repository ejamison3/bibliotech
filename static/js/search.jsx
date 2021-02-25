"use strict"

const SearchBar = (prop) => {
  let history = useHistory();

  const performSimpleSearch = (evt) => {
    evt.preventDefault();
    
    // maybe use useEffect to do api search call?
    //  array that changes is search criteria
    //  sets dictionary that is search results
    //save search results to state as dictionaries
    // loop through state dictionaries to display in searchResults
    history.push("/searchResults")
  }

  if (prop.userId === null) {
    return;
  }else{
    return (
      <div>
        <form>
          <label htmlFor="search-type-dropdown"></label>
          <select id="search-type-dropdown" type="dropdown">
            <option value="Title" defaultValue>Title</option>
            <option value="Author">Author</option>
            <option value="Tag">Tag</option>
          </select>
          <label htmlFor="search-field"></label>
          <input id="search-field" type="text" placeholder="Type search phrase" autoFocus/>
          <button onClick={performSimpleSearch}>Search</button>
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
  return (
    <div>
      This is the search results
    </div>
  )
}