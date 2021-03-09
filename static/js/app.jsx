"use strict";
const Router = ReactRouterDOM.BrowserRouter;
const Link = ReactRouterDOM.Link;
const Switch = ReactRouterDOM.Switch;
const Route = ReactRouterDOM.Route;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;
const {Container, Col, Row, Tabs, Tab, Jumbotron, Button} = ReactBootstrap;


const Home = (prop) => {
  // prevent book from still being editable if user clicked away from editable page

  if (prop.userId === null) {
    return (
      <div className="center-text">
        <h1>Welcome to BiblioTech!</h1>
        <p>Please login to use the site</p>
      </div>
    )
  }else{
    return (
      <div className="center-text">
        <h1>Welcome to BiblioTech {prop.username}!</h1>
        <p>You are on the home screen</p>
      </div>
    )
  }
};

const Header = (prop) => {
  const onLogoClick = () => {
    prop.userId != null ? (prop.setDisplaySearchBar(true)) : ''
    prop.setIsEditable(false)
  }

  return (
    // <div id="header">
    // <Container>
      <Row>
        <Col md={3} lg={3}>
          <Link to="/" className="column-logo" 
            onClick={() => prop.userId != null
              ? (prop.setDisplaySearchBar(true))
              : ''}>
            <img className="logo" src="/static/img/BiblioTechLogo.png" />
          </Link>
        </Col>
        <Col md={6} lg={6}>
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
            isEditable={prop.isEditable}
            setIsEditable={prop.setIsEditable}
            /> 
            : <div className="no-searchbar"></div>
          }
        </Col>
        <Col md={3} lg={3}>
          <div className="user-buttons">
            {prop.userId != null 
              ? <button className="user-button"><Link to={'/account'}>Account</Link></button>
              : ''
            }
            {prop.userId != null
              ? <button className="user-button"><Link to={'/logout'}>Logout</Link></button>
              : <button className="user-button"><Link to={'/login'}>Login</Link></button>
            }
          </div>
        </Col>
      </Row>
    // </Container>
    //  </div>
  )
}


const Footer = (prop) => {
  return (
    // <div id="footer">
    <Container>
      <Row>
        <h4 className="center">BIBLIOTECH</h4>
      </Row>
      <Row>
      {/* <div className="container"> */}
        <Col xs={4}>
          About BiblioTech:
          <li>
            <Link to={'/about'} className="footer-link">Learn about BiblioTech</Link>
          </li>
          <li>
            <Link to={'/about/search'} className="footer-link">Search methodologies</Link>
          </li>
          <li>
            <Link to={'/about/data'} className="footer-link">Data &amp; Seeding Process</Link>          
          </li>
        {/* <div> */}
        </Col>
        <Col xs={4}>
          About Elizabeth:
          <li>
            <a href="https://github.com/ejamison3" target="_blank">Github</a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/ejamison3/" target="_blank">LinkedIn</a>
          </li>
        </Col>
        {/* </div> */}
      {/* </div> */}
    </Row>
    <Row>
      <p>Created by: Elizabeth M Jamison</p>
      <Button variant="secondary">Something</Button>
    </Row>
    </Container>
    // </div>÷
  )
}

const App = () => {
  const [userId, setUserId] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState(null);
  const [searchResponse, setSearchResponse] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [bookResponse, setBookResponse] = React.useState(null);
  const [isEditable, setIsEditable] = React.useState(false);
  const [displaySearchBar, setDisplaySearchBar] = React.useState(true);

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
      <Container>
      {/* <div id="app"> */}
        <Header 
          userId = {userId}
          username={username}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          displaySearchBar={displaySearchBar}
          setDisplaySearchBar={setDisplaySearchBar}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
        /> 
        <main>
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
                isEditable={isEditable}
                setIsEditable={setIsEditable}
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
            <Route path='/about/data'>
              <AboutData />
            </Route>
            <Route path='/about/search'>
              <AboutSearch />
            </Route>
            <Route path='/about'>
              <About />
            </Route>
            <Route path="/createUser">
              <DisplayCreateUser />
            </Route>
          </Switch>
        </main>
        <Footer/>  
      </Container>
      {/* </div> */}
    </Router>
  )
};

ReactDOM.render(
  <App />,
  document.querySelector('#root')
);