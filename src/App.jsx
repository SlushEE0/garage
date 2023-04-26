import React from 'react';
import Toast from 'react-hot-toast';

export default function App({ UsersArr }) {
  const storedUser = localStorage.getItem('UserData');

  const [auth, SETauth] = React.useState(UsersArr.includes(storedUser));
  const [allowed, SETallowed] = React.useState(true);

  if (!auth) {
    const [userInput, SETuserInput] = React.useState();

    if (userInput && UsersArr.includes(userInput)) {
      localStorage.setItem('UserData', userInput);
      window.location.reload();
    }

    return (
      <main className='loginContainer'>
        <h1 className='loginText'>Please Login</h1>
        <input
          className='loginInput'
          type='text'
          onChange={(e) => {
            SETuserInput(e.target.value);
          }}
          value={userInput}
          placeholder='USERNAME'></input>
      </main>
    );
  } else if (auth) {
    const logout = function () {
      localStorage.removeItem('UserData');
      window.location.reload();
    };

    const changeGarageState = async function () {
      SETallowed(false);
      if (!auth) window.location.reload();
      if (!confirm('Open Garage?')) return;

      console.log('confimed');

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

      setTimeout(() => {
        SETallowed(true);
      }, 2000);
    };

    return (
      <>
        <button
          className='openBtn'
          onClick={changeGarageState}
          disabled={!allowed}>
          Click me to Open Garage
        </button>
        <button className='logoutBtn' onClick={logout}>
          Log Out
        </button>
      </>
    );
  } else {
    return <h1>Something went horribly wrong, refresh the page</h1>;
  }
}
