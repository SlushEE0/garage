import React from 'react';

import toast from 'react-hot-toast';

import './App.css';

const ESPHOME_KEY =
  'eyJzdWIiOiJFU1BIb21lIiwibmFtZSI6IkdhcmFnZSIsImlhdCI6MTUxNjIzOTAyMn0';
const GEOCODING_KEY = '61cefcc612msh04fe1c5b7be6beep1c7dd8jsn5cd0b3377281';

export default function App() {
  const [auth, SETauth] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      getLocationAuth();
      getLocationAuth = async () => {};
    })();
  }, []);

  let getLocationAuth = async function () {
    if (localStorage.getItem('authorized')) return SETauth(true);

    let coords: Array<number> = [];

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        console.log(pos);
        toast.loading('Authorizing');

        coords = [pos.coords.latitude, pos.coords.longitude];

        const zipCode = await fetch(
          `https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=${coords[0]}&lon=${coords[1]}&accept-language=en&polygon_threshold=0.0`,
          {
            headers: {
              'X-RapidAPI-Key': GEOCODING_KEY,
              'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
            }
          }
        )
          .then((res) => res.json())
          .then((res) => res.address.postcode);

        if (zipCode === '92127') {
          SETauth(true);
          localStorage.setItem('authorized', 'true');

          toast.success('!You are Authorized!');
        }
      },
      (err) => console.error('error', err)
    );

    return;
  };

  if (auth) {
    return <GarageDashboardPage />;
  } else {
    return <LoginPage />;
  }
}

function GarageDashboardPage() {
  const handleGarageBtnClick = async function () {
    const resp = await fetch('http://esphome.webredirect.org/api/garage', {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json'
      },
      mode: "no-cors",
      body: JSON.stringify({ auth: ESPHOME_KEY }),
      method: 'POST'
    });

    console.log(resp);

    toast.success('Garage Opened/Closed');
  };

  return (
    <main>
      <button className='garageBtn' onClick={handleGarageBtnClick}></button>
    </main>
  );
}

function LoginPage() {
  return <main>Login</main>;
}
