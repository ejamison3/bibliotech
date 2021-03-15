"use strict"

const About = (prop) => {
  return (
    <Tabs
      activeKey={prop.tabKey}
      onSelect={(k) => prop.setTabKey(k)}
    >
      <Tab eventKey="about" title="About">
        <div>
          BiblioTech is a single page web application (SPWA) built over the course of 4 weeks as part of the Hackbright Academy program.
          <div>
            BiblioTech was built using the following technologies:
            <li>
              Python3, including flask, sqlalchemy
            </li>
            <li>
              Javascript, react &amp; jsx
            </li>
          </div>
        </div>
      </Tab>
      <Tab eventKey="data" title="Data">
        <AboutData/>
      </Tab>
      <Tab eventKey="search" title="Search">
        <AboutSearch/>
      </Tab>
    </Tabs>
  )
}

const AboutData = () => {
  const dataModelToDisplay = 0;

  return (
    <div>
      <div>
        <b>Data</b>:
        The data displayed and used in this project comes from two sources:
        <li>  
          A "small" subset of Amazon reviews of Books from 2018. The dataset can be found
          <a href="https://nijianmo.github.io/amazon/index.html" target="_blank">here.</a> The paper cited below details the methodologies used to compile this data. (The paper can also be found 
          <a href="http://cseweb.ucsd.edu/~jmcauley/pdfs/emnlp19a.pdf" target="_blank"> here</a>
          )
          <div>
            Citation:
            <div>
              <b>
                Justifying recommendations using distantly-labeled reviews and fined-grained aspects
              </b>
                <br/>
                Jianmo Ni, Jiacheng Li, Julian McAuley
              <p>
                <i>Empirical Methods in Natural Language Processing (EMNLP), 2019</i>
              </p>
            </div>
          </div>
        </li>
        <li>
          The Google Books API was utilized to fill in book information (e.g., title, authors, category, description) by querying by ISBN from the review data.
        </li>
        <Carousel>
          <Carousel.Item>
            <img 
              className="d-block w-100"
              src="/static/img/DataModel.png"
              alt="InitialDataModel"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img 
              className="d-block w-100"
              src="/static/img/GoogleDataModel.png"
              alt="InitialDataModel"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img 
              className="d-block w-100"
              src="/static/img/AmazonDataModel.png"
              alt="InitialDataModel"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img 
              className="d-block w-100"
              src="/static/img/AvgRatingDataModel.png"
              alt="InitialDataModel"
            />
          </Carousel.Item>
        </Carousel>
      </div>
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
          <b>ISBN</b>: exact search - will only return a book whose ISBN matches exactly. Case insensitive.
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