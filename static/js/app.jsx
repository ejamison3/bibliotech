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
          <Link to="/"><img className="home-logo header-part" src="/static/img/book.png" /></Link>
          <button>
            <Link to={'/login'}>Login</Link>
          </button>
        </header>
    )
  }else{
    return (
      <header>
          <Link to="/"><img className="home-logo header-part" src="/static/img/book.png" /></Link>
          <SearchBar 
            userId = {prop.userId}
            history={prop.history}
          />
          <button>
            <Link to={'/logout'}>Logout</Link>
          </button>
        </header>
    )
  }
}



const App = () => {
  const [userId, setUserId] = React.useState(null);
  const [username, setUsername] = React.useState(null);

  // const logInOutButton = (userId === null) ? 'Login' : 'Logout';
  // const logInOutUrl = (userId === null) ? '/login' : '/logout';

  return (
    <Router>
      <div>
        <Header 
          userId = {userId}
          username={username}/>
        <footer>
          <div>Icons made by <a href="" title="Good Ware">Good Ware</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
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
          <Route exact path="/createUser">
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