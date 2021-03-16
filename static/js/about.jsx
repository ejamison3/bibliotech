"use strict"

const About = (prop) => {
  return (
    <Tabs
      activeKey={prop.tabKey}
      onSelect={(k) => prop.setTabKey(k)}
    >
      <Tab eventKey="about" title="About">
        <AboutBasic/>
      </Tab>
      <Tab eventKey="tech" title="Tech Stack">
        <AboutTech/>
      </Tab>
      <Tab eventKey="data" title="Data">
        <AboutData/>
      </Tab>
      <Tab eventKey="search" title="Search">
        <AboutSearch/>
      </Tab>
      <Tab eventKey="recommend" title="Recommendation">
        <AboutRecommend/>
      </Tab>
    </Tabs>
  )
}

const AboutBasic = () => {
  return (
    <div>
      BiblioTech is a single page web application (SPWA) built over the course of 4 weeks as part of the Hackbright Academy program.
      <div>
      BiblioTech allows users to search, rate, and track books as well as get book recommendations. Initially motivated by a desire to build a digital catalog of Elizabeth's physical books, BiblioTech has evolved to provide enhanced search functionality and a recommendation engine. Appropriate seed data for the recommendation algorithm was parsed out of an available subset of Amazon Reviews using an iterable, repeatable process developed using command line scripting and python. In future iterations, Elizabeth hopes to incorporate additional fuzzy search functionality and explore additional recommendation options in future iterations.
      </div>
    </div>
  )
}

const AboutTech = () => {
  return(
    <Row>
      <Col md={{span:6, offset:3}}>
      <img 
        className="d-block w-100"
        src="/static/img/SystemDiagram.png"
        alt="DataModel"
      />
      </Col>
    </Row>
  )
}

const AboutData = () => {
  const [dataModelNum, setDataModelNum] = React.useState(0);
  // const dataModelNum = 0;
  const dataModelToDisplay = "/static/img/DataModel" + dataModelNum + ".png";

  return (
    <div>
      <div>
        <div>
          <Row>
            <Col>
              <button className="button-data-beige" onClick={() => {
                  setDataModelNum(0)
                }}
              >
                Basic Data Model
              </button>
            </Col>
            <Col>
              <button className="button-data-green" onClick={() => {
                    setDataModelNum(1)
                  }}
                >
                Add Google Books API Data
              </button>
            </Col>
            <Col>
              <button className="button-data-yellow" onClick={() => {
                    setDataModelNum(2)
                  }}
                >
                Add Amazon Review Data
              </button>
            </Col>
            <Col>
              <button className="button-data-pink" onClick={() => {
                    setDataModelNum(3)
                  }}
                >
                Add Amazon Review Data
              </button>
            </Col>
          </Row>
          <Row>
            <Col md={{span: 8, offset:2}}>
              <img 
                className="d-block w-100"
                src={dataModelToDisplay}
                alt="DataModel"
                />
            </Col>
          </Row>
        </div>
        <div>
          <b>Data displayed and used in this project comes from two sources:</b>
          <li>  
            A "small" subset of Amazon reviews of Books from 2018. The dataset can be found&nbsp;
            <a href="https://nijianmo.github.io/amazon/index.html" target="_blank">here.</a> The paper cited below details the methodologies used to compile this data. (The paper can also be found 
            <a href="http://cseweb.ucsd.edu/~jmcauley/pdfs/emnlp19a.pdf" target="_blank"> here</a>
            )
            <div className="tab">
                <b>
                  Justifying recommendations using distantly-labeled reviews and fined-grained aspects
                </b>
                  <br/>
                  Jianmo Ni, Jiacheng Li, Julian McAuley
                <p>
                  <i>Empirical Methods in Natural Language Processing (EMNLP), 2019</i>
                </p>
            </div>
          </li>
          <li>
            The Google Books API was utilized to fill in book information (e.g., title, authors, category, description) by querying by ISBN from the review data.
          </li>
        </div>
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

const AboutRecommend = () => {
  return(
    <Row>
      <Col>
        Recommendations
      </Col>
    </Row>
  )
}