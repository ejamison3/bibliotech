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
      This is stuff about the search used in BiblioTech
      <h2 className="center">Basic Search</h2>
      <div>
        The basic search has four search criteria:
        Title - case insensitive, title contains
        Author - last name of single Author, case insensitive
        Tag - comma separated multiple tags (OR)
        User: book belongs to current user
      </div>

      <h2>Advanced Search</h2>
      <div>The advanced search has lots of </div>
    </div>
  )
}