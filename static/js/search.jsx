"use strict"

const SearchBar = (prop) => {
  if (prop.userId === null) {
    return;
  }else{
    return (
      <div>
        <form>
          <label for="search-field"></label>
          <input type="text" placeholder="Search for books" autoFocus/>
          <input list="search-options" type="dropdown"></input>
            <datalist id="search-options">
              <option value="Title"/>
              <option value="Author"/>
              <option value="Tag"/>
            </datalist>
          <button>Search</button>
        </form>
      </div>
    )
  }
}