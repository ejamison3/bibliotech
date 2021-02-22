"use strict";

// For components related to user login/logout & create user


const DisplayCreateUser = () => {
  let history = useHistory();

  console.log('in DisplayCreateUser')

  const CreateUser = (evt) => {
    evt.preventDefault();

    const username = document.getElementById('username').value;
    const pwd = document.getElementById('pwd').value;
    const pwdDup = document.getElementById('pwd-dup').value;

    if (pwd != pwdDup){
      alert('Password does not match. Please enter your password twice.');
      return;
    }

    fetch('createAccount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        pwd,
        pwdDup,
      })
    })
    .then(response => {
      if (response.status !== 200){
        alert('Username already exists or passwords don\'t match')
        return;
      }
      response.json().then(data => {
        alert('User ' + username + ' created! Please log in.')
        history.push("/login")
      })
    })
  }

  return (
    <div className="center-text">
      <h1 className="center-text">Create Account</h1>
      <form className="center" action="/createAccount" method="POST">
          <label htmlFor="username">Username: </label>
          <input type="text" id="username" name="username" maxLength="20" placeholder="username" required autoFocus/>
          <br/>
          <label htmlFor="pwd">Password: </label>
          <input type="password" id="pwd" name="pwd" maxLength="30" placeholder="***" required />
          <br/>
          <label htmlFor="pwd-dup">Confirm Password: </label>
          <input type="password" id="pwd-dup" name="pwd-dup" maxLength="30" placeholder="***" required />
          <br/>
          <button onClick={CreateUser} id="user-create">Create Account</button>
        </form>
    </div>
  )
}


const DisplayLogin = (prop) => {
  let history = useHistory();


  const LoginUser = (evt) => {
    evt.preventDefault();

    const username = document.getElementById('username').value;
    const pwd = document.getElementById('pwd').value;
  
    fetch('userLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        pwd
      })
    })
    .then(response => {
      if (response.status !== 200){
        alert('Login Failed. Username and/or password is incorrect');
        return;
      }
      response.json().then(data => {
        prop.setUserId(data.user_id)
        prop.setUsername(data.username)
        history.push("/")
      })
    })    
  }

  if (prop.userId === null || prop.userId === undefined){
    return (
      <div>
        <h2 className="center-text">Log In</h2>
        <form className="center" action="/userLogin" method="POST">
          <label htmlFor="username">Username: </label>
          <input type="text" id="username" name="username" maxLength="20" placeholder="username" required autoFocus/>
          <br/>
          <label htmlFor="pwd">Password: </label>
          <input type="password" id="pwd" name="pwd" maxLength="30" required />
          <br/>
          <button onClick={LoginUser} id="user-login">Login</button>
        </form>
        <Link to="/createUser" className="center-text">
          <p className="center-text">Create Account</p>
        </Link>
      </div>
    )
  }else{
    return (
      <Home
        userId={prop.userId}
        username={prop.username}
      />)
  }
};

const DisplayLogout = (prop) => {
  const prev_username = prop.username

  prop.setUserId(null);
  prop.setUsername(null);

  document.cookie = 'user_id=; Max-Age=-9999;';
  document.cookie = 'username=; Max-Age=-9999;';

  return (
    <div>
      Goodbye {prev_username}! <br/>
      You have been logged out!
    </div>
  )

};