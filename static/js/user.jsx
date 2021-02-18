"use strict";

// For components related to user login/logout & create user


const DisplayLogin = () => {

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
      return response.json()
    })
    .then(data => {
      if (data.error != null){
        alert('Login Fail: ' + data.error)
      }else{
        alert('Welcome ' + data.username)
        // update state
        alert('user id is ' + data.user_id)
      }
      // return false;
    })
    // do stuff here to log user in and set user_id (probably as a separate message)
    // use fetch to see if it actually logged user in or not
    
  }

  return (
    <div>
      <h2>Log In</h2>
      <form className="center" action="/userLogin" method="POST">
        <label htmlFor="username">Username: </label>
        <input type="text" id="username" name="username" maxLength="20" required autoFocus/>
        <br/>
        <label htmlFor="pwd">Password: </label>
        <input type="password" id="pwd" name="pwd" maxLength="30" required />
        <br/>
        <button onClick={LoginUser} id="user-login">Login</button>
      </form>
    </div>
  )
};

// ReactDOM.render(
//   <LoginUser />,
//   document.querySelector('#user-login')
// );