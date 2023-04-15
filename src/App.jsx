import React from 'react';
const PASSWORD = 'gadem';

export default function App() {
  const isAuthorized = localStorage.getItem('isAuthorized');
  const [auth, SETauth] = React.useState(
    isAuthorized === PASSWORD ? true : false
  );
  const [allowed, SETallowed] = React.useState(true);

  const changeGarageState = async function () {
    SETallowed(false);
    if (!auth) window.location.reload();

    await fetch(
      'https://garageopener-27000-default-rtdb.firebaseio.com/state.json',
      {
        method: 'PUT',
        body: JSON.stringify(1)
      }
    );

    await new Promise((resolve) => setTimeout(resolve, 750));

    SETallowed(true);
  };

  if (!auth) {
    const [authInput, SETauthInput] = React.useState('');

    if (authInput && authInput === PASSWORD) {
      localStorage.setItem('isAuthorized', authInput);
      window.location.reload();
    }

    return (
      <>
        <h1 className='loginText'>Please Login</h1>
        <input
          className='authInput'
          type='text'
          onChange={(e) => {
            SETauthInput(e.target.value);
          }}
          value={authInput}
          placeholder='Password'></input>
      </>
    );
  } else if (auth) {
    return (
      <button
        className='garageBtn'
        onClick={changeGarageState}
        disabled={!allowed}>
        Click me to Open Garage
      </button>
    );
  } else {
    return <h1>Something went horribly wrong, refresh the page</h1>;
  }
}
