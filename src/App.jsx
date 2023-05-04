import React from 'react';
import Toast from 'react-hot-toast';

export default function App({ UsersArr }) {
  const storedUser = localStorage.getItem('UserData');
  const auth = UsersArr.includes(storedUser);

  if (!auth) {
    return <LoginPage UsersArr={UsersArr} />;
  } else if (auth) {
    return <OpenPage user={storedUser ? storedUser : null}/>;
  } else {
    return <h1>Something went horribly wrong, refresh the page</h1>;
  }
}

function LoginPage({ UsersArr }) {
  const [userInput, SETuserInput] = React.useState('');

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
}

function OpenPage({user}) {
  const [allowed, SETallowed] = React.useState(true);

  const logout = function () {
    localStorage.removeItem('UserData');
    window.location.reload();
  };

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

    setTimeout(() => {
      SETallowed(true);
    }, 2000);
  };

  return (
    <main>
      <button className='logoutBtn btn-grey' onClick={logout}>
        Log Out
      </button>
      <button
        className='openBtn'
        onClick={changeGarageState}
        disabled={!allowed}>
        Click me to Open Garage
      </button>
    </main>
  );
}
