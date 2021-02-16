"use strict";

function HeaderContainer() {
  return (
    <header id='header-container'>
      <h1>Proof header is working</h1>
      <div id='pineapple'>

      </div>
    </header>

  );
}

ReactDOM.render(<HeaderContainer />, document.querySelector('#root'));