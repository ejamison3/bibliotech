"use strict";
const Router = ReactRouterDOM.BrowserRouter;
const Link = ReactRouterDOM.Link;
const Switch = ReactRouterDOM.Switch;
const Route = ReactRouterDOM.Route;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;
const {Container, Badge, Button, Card, Carousel, Col, Form, Modal, Navbar, Row, Spinner, Tabs, Tab} = ReactBootstrap;

// Removed CardDeck

const Home = (prop) => {
  // prevent book from still being editable if user clicked away from editable page

  if (prop.userId === null) {
    return (
      <div className="center-text">
        <h1>Welcome to BiblioTech!</h1>
        <p>Please login to use the site</p>
        <img className="img-home" src="/static/img/Typewriter.png"/>
      </div>
    )
  }else{
    return (
      <div className="center-text">
        <h1>Welcome to BiblioTech {prop.username}!</h1>
        <img className="img-home" src="/static/img/Typewriter.png"/>
      </div>
    )
  }
};

const Header = (prop) => {
  // const onLogoClick = () => {
  //   prop.userId != null ? (prop.setDisplaySearchBar(true)) : ''
  // }

  return (
      <Navbar className="header" sticky="top">
        <Col md={2}>
          <Link to="/" className="column-logo" 
            onClick={() => prop.userId != null
              ? (prop.setDisplaySearchBar(true))
              : ''}>
            <img className="logo" src="/static/img/LogoArtDeco.png" />
          </Link>
        </Col>
        <Col md={6}>
          {(prop.displaySearchBar == true) && (prop.userId != null)
            ? <SearchBar 
            userId = {prop.userId}
            history={prop.history}
            searchQuery={prop.searchQuery}
            setSearchQuery={prop.setSearchQuery}
            isLoading={prop.isLoading}
            setIsLoading={prop.setIsLoading}
            displaySearchBar={prop.displaySearchBar}
            setDisplaySearchBar={prop.setDisplaySearchBar}
            /> 
            : <div className="no-searchbar"></div>
          }
        </Col>
        <Col md={2}>
          <button className="button-recommend">
            <Link to={"/recommendation"}>
              Get Book Recommendation
            </Link>
          </button>
        </Col>
        <Col md={2}>
          <div className="user-buttons">
            {prop.userId != null 
              ? <button className="user-button">
                  <Link to={'/account'}>Account</Link>
                </button>
              : ''
            }
            {prop.userId != null
              ? <button className="user-button"><Link to={'/logout'}>Logout</Link></button>
              : <button className="user-button"><Link to={'/login'}>Login</Link></button>
            }
          </div>
        </Col>
      </Navbar>
  )
}

const Footer = (prop) => {
  return (
    <Container className="footer">
      <Row className="justify-content-center">
        <Col className="align-self-center center-text">
            BIBLIOTECH
        </Col>
      </Row>
      <Row className="justify-content-around">
        <Col className="align-self-center">
          About BiblioTech:
          <li>
            <Link to={'/about'} className="footer-link" onClick={() => {
              prop.setTabKey('about')
              }}>
              Learn about BiblioTech
            </Link>
          </li>
          <li>
            <Link to={'/about'} className="footer-link" onClick={() => {
              prop.setTabKey('data')
              }}>
              Data &amp; Seeding Process
            </Link>          
          </li>
          <li>
            <Link to={'/about'} className="footer-link" onClick={() => {
              prop.setTabKey('search')
              }}>
              Search methodologies
            </Link>
          </li>
        </Col>
        <Col>
          About Elizabeth:
          <li>
            <a href="https://github.com/ejamison3" target="_blank">Github</a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/ejamison3/" target="_blank">LinkedIn</a>
          </li>
        </Col>
      </Row>
      <Row>
        <p>Created by: Elizabeth M Jamison</p>
      </Row>
    </Container>
  )
}

const App = () => {
  const [userId, setUserId] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState(null);
  const [searchResponse, setSearchResponse] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [bookResponse, setBookResponse] = React.useState(null);
  const [displaySearchBar, setDisplaySearchBar] = React.useState(true);
  const [tabKey, setTabKey] = React.useState('about')

  if (userId === null && document.cookie != ""){
    // check if there is a user_id cookie
    const cookie_userId = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_id='))
      .split('=')[1];

    if (cookie_userId !== null){
      const cookie_username = document.cookie
        .split('; ')
        .find(row => row.startsWith('username='))
        .split('=')[1];

        setUserId(cookie_userId);
        setUsername(cookie_username);
    }
  }

  return (
    <Router>
      
        <Header 
          userId = {userId}
          username={username}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          displaySearchBar={displaySearchBar}
          setDisplaySearchBar={setDisplaySearchBar}
        /> 
        <Container fluid className="main-container">
          <Switch>
            <Route exact path="/">
              <Home 
                userId={userId}
                username={username}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                history={history}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                displaySearchBar={displaySearchBar}
                setDisplaySearchBar={setDisplaySearchBar}
              />
            </Route>
            <Route path="/searchResults">
              <DisplaySearchResults 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResponse={searchResponse}
                setSearchResponse={setSearchResponse}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </Route>
            <Route path="/book/:bookId">
              <DisplayBook 
                userId={userId}
                bookResponse={bookResponse}
                setBookResponse={setBookResponse}
              />
            </Route>
            <Route path="/search/advanced">
              <AdvancedSearch 
                userId={userId}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                displaySearchBar={displaySearchBar}
                setDisplaySearchBar={setDisplaySearchBar}
              />
            </Route>
            <Route path="/recommendation">
              <Recommendation 
                userId={userId}
                bookResponse={bookResponse}
                setBookResponse={setBookResponse}
              />
            </Route>
            <Route path="/account">
              <DisplayAccount 
                userId={userId}
                username={username}
                
                history={history}
              />
            </Route>
            <Route path="/login">
              <DisplayLogin 
                userId={userId}
                setUserId={setUserId}
                username={username}
                setUsername={setUsername}
                history={history}
              />
            </Route>
            <Route path="/logout">
              <DisplayLogout
                userId = {userId}
                setUserId={setUserId}
                username={username}
                setUsername={setUsername}
                history={history}
              />
            </Route>
            {/* <Route path='/about/data'>
              <About />
            </Route>
            <Route path='/about/search'>
              <AboutSearch />
            </Route> */}
            <Route path='/about'>
              <About 
                tabKey={tabKey}
                setTabKey={setTabKey}
              />
            </Route>
            <Route path="/createUser">
              <DisplayCreateUser />
            </Route>
          </Switch>
        </Container>
        <Footer
          tabKey={tabKey}
          setTabKey={setTabKey}
        />  
    </Router>
  )
};

ReactDOM.render(
  <App />,
  document.querySelector('#root')
);