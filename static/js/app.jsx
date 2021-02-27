"use strict";
const Router = ReactRouterDOM.BrowserRouter;
const Link = ReactRouterDOM.Link;
const Switch = ReactRouterDOM.Switch;
const Route = ReactRouterDOM.Route;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;


const Home = (prop) => {
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

  if (prop.userId === null){
    return (
      <header>
          <Link to="/"><img className="home-logo header-part" src="/static/img/BiblioTechLogo.png" /></Link>
          <button>
            <Link to={'/login'}>Login</Link>
          </button>
        </header>
    )
  }else{
    return (
      <header>
          <Link to="/"><img className="home-logo header-part" src="/static/img/BiblioTechLogo.png" /></Link>
          <SearchBar 
            userId = {prop.userId}
            history={prop.history}
            searchQuery={prop.searchQuery}
            setSearchQuery={prop.setSearchQuery}
            isLoading={prop.isLoading}
            setIsLoading={prop.setIsLoading}
          />
          <button>
            <Link to={'/account'}>Account</Link>
          </button>
          <button>
            <Link to={'/logout'}>Logout</Link>
          </button>
        </header>
    )
  }
}


const Footer = (prop) => {
  return (
    <footer>
      <div>
        <h4 className="center">BIBLIOTECH</h4>
        <br/>
        <Link to={'/about/search'} className="footer-link">Learn about our search methodologies</Link>
        <br/>
        <Link to={'/about'} className="footer-link">Learn about BiblioTech</Link>
      </div>
      <p>UnicornBread</p>
    </footer>
  )
}

const App = () => {
  const [userId, setUserId] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState(null);
  const [searchResponse, setSearchResponse] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [bookResponse, setBookResponse] = React.useState(null);

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
      <div id="main-div">
        <Header 
          userId = {userId}
          username={username}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <Footer/>          

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
            />
          </Route>
          <Route path="/searchResults">
            <DisplaySearchResults 
              searchQuery={searchQuery}
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
      </div>
    </Router>
  )
};

ReactDOM.render(
  <App />,
  document.querySelector('#root')
);