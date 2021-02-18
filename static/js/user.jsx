"use strict";

// For components related to user login/logout & create user



const DisplayLogin = (prop) => {

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
      })
    })    
  }

  if (prop.userId === null){
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
  }else{
    return (<Home />)
  }
};

const DisplayLogout = (prop) => {
  //log user out
  //remove from prop

  return (
    <div>
      Goodbye previously logged in user!
    </div>
  )

};