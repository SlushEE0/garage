import React from 'react';
import Toast from 'react-hot-toast';
import { usernames } from '../lib/firebase.js';

export default function App() {
  const storedUser = localStorage.getItem('storedUser');
  const [auth, SETauth] = React.useState(
    usernames.includes(storedUser) ? true : false
  );
  const [allowed, SETallowed] = React.useState(true);

  const changeGarageState = async function () {
    SETallowed(false);
    if (!auth) window.location.reload();

    try {
      await fetch(
        `https://garageopener-27000-default-rtdb.firebaseio.com/${storedUser}/state.json`,
        {
          method: 'PUT',
          body: JSON.stringify(1)
        }
      );
    } catch (err) {
      Toast.err('Something went wrong');
      console.err(err);
    }

    Toast.success('Opening / Closing Garage');

    await new Promise((resolve) => setTimeout(resolve, 1500));
    SETallowed(true);
  };

  if (!auth) {
    const [authInput, SETauthInput] = React.useState('');

    if (authInput && usernames.includes(authInput)) {
      localStorage.setItem('storedUser', authInput);
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
          placeholder='USERNAME'></input>
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
