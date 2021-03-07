"use strict"

const About = () => {
  return (
    <div>
      This is stuff about BiblioTech
    </div>
  )
}


const AboutSearch = () => {
  return (
    <div>
      BiblioTech offers two searches to meet your needs - basic and advanced.
      <h2 className="center">Basic Search</h2>
      <div>
        The basic search offers the ability to searchy by one of four fields:
        <li>
          <b>Title</b> - case insensitive, title contains the search phrase
        </li>
        <li>
          <b>Author</b> - last name of single Author, case insensitive
        </li>
        <li>
          <b>Tag</b>: comma separated multiple tags (OR). Search will work with or without a space following a comma
        </li>
        <li>
          <b>ISBN</b>: exact search - will only return a book whose ISBN matches exactly
        </li>
        Additionally, searches can be configured to return only books which belong to the current user.
      </div>

      <h2>Advanced Search</h2>
      <div>
        The advanced search offers a more precise search. Similar to the basic search, the search is configurable by title, author, tag, ISBN, and user. However, the user can search by one or more of these fields - mixing and matching to meet their desires. 
      </div>

      <h2>Bonus Search Functionality</h2>
      <div>
        In addition to the Basic and Advanced search functionality, it is possible to search direclty from the search results including:
        <li>
          Clicking any Tag in the search results will return all books with that tag
        </li>
      </div>
    </div>
  )
}