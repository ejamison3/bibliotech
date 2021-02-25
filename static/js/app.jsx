"use strict";
const Router = ReactRouterDOM.BrowserRouter;
const Link = ReactRouterDOM.Link;
const Switch = ReactRouterDOM.Switch;
const Route = ReactRouterDOM.Route;
const useHistory = ReactRouterDOM.useHistory;


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


// const Footer = (prop) => {
//   return (
//     <footer>
//       <Link to={'/about/search'}>Learn about our search methodologies</Link>
//     </footer>
//   )
// }

const App = () => {
  const [userId, setUserId] = React.useState(null);
  const [username, setUsername] = React.useState(null);


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
        />
        <footer>
          <div>UnicornBread</div>
        </footer>

        <Switch>
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
          <Route exact path="/">
            <Home 
              userId={userId}
              username={username}
              history={history}
            />
          </Route>
          <Route path="/createUser">
            <DisplayCreateUser />
          </Route>
          <Route path="/account">
            <DisplayAccount 
              userId={userId}
              username={username}
              history={history}
            />
          </Route>
          <Route path="/searchResults">
            <DisplaySearchResults />
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