"use strict"

const SearchBar = (prop) => {
  if (prop.userId === null) {
    return;
  }else{
    return (
      <div>
        <form>
          <select id="search-type-dropdown" type="dropdown">
            <option value="Title" selected/>
            <option value="Author"/>
            <option value="Tag"/>
          </select>
          <label htmlFor="search-field"></label>
          <input type="text" placeholder="Type search phrase" autoFocus/>
          <button>Search</button>
        </form>
      </div>
    )
  }
}