"use strict";
const Router = ReactRouterDOM.BrowserRouter;
const Link = ReactRouterDOM.Link;
const Switch = ReactRouterDOM.Switch;
const Route = ReactRouterDOM.Route;

const Home = () => {
  return (
    <div>
      <h1>Welcome to BiblioTech!</h1>
      <p>You are on the home screen</p>
    </div>
  )
};


<div>Icons made by <a href="" title="Good Ware">Good Ware</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

const App = (props) => {
  const [userId, setUserId] = React.useState(null);

  return (
    <Router>
      <div>
        
        <header>
          <Link to="/"><img className="home-logo header-part" src="/static/img/book.png"/></Link>
          <button className="header-part">
            <Link to="/">Home</Link>
          </button>
          <button className="header-part">
            <Link to="/login">Log In</Link>
          </button>
        </header>

        <Switch>
          <Route path="/login">
            <DisplayLogin />
          </Route>
          <Route exact path="/">
            <Home />
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