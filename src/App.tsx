import React from 'react';

import toast from 'react-hot-toast';

import { boolSetState } from '../lib/types';
import './App.css';

const ESPHOME_KEY =
  'eyJzdWIiOiJFU1BIb21lIiwibmFtZSI6IkdhcmFnZSIsImlhdCI6MTUxNjIzOTAyMn0';
const GEOCODING_KEY = '61cefcc612msh04fe1c5b7be6beep1c7dd8jsn5cd0b3377281';
const AUTH_PASSWORDS = ['gadem'];
const VALID_ZIPS = ['92127'];

export default function App() {
  const [auth, SETauth] = React.useState(false);

  let locationAuth = function () {
    let coords: Array<number> = [];

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        console.log(pos);
        toast.loading('Authorizing', { duration: 2000 });

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

        if (VALID_ZIPS.includes(zipCode)) {
          SETauth(true);
          localStorage.setItem('authorized', 'true');

          toast.success('You are Authorized !');
        }
      },
      (err) => console.error('error', err)
    );

    return;
  };

  React.useEffect(() => {
    if (localStorage.getItem('authorized')) SETauth(true);
    locationAuth();
    locationAuth = () => {};
  }, []);

  if (auth) {
    return <GarageDashboardPage />;
  } else {
    return <LoginPage {...{ auth, SETauth }} />;
  }
}

function GarageDashboardPage() {
  const [openAllowed, SETopenAllowed] = React.useState(true);
  let openRequests = 0;
  let timeouts: number[] = [];

  const handleGarageBtnClick = async function () {
    const resp = await fetch('https://esphome.webredirect.org/api/garage', {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ auth: ESPHOME_KEY }),
      method: 'PUT'
    });
    console.log(resp);

    toast.success('Garage Opened/Closed');
    openRequests++;

    if (openRequests > 2 && openRequests < 5) {
      timeouts.push(
        setTimeout(() => {
          openRequests = 0;

          //clear all timeouts after 7 seconds except the final warning one
          timeouts.forEach((id) => {
            clearTimeout(id);
          });
        }, 5000)
      );
    } else if (openRequests >= 5) {
      SETopenAllowed(false);

      toast.loading('Try again in 10 seconds', {
        position: 'top-center',
        duration: 11000
      });
      toast.error('Too many requests...CHILL', {
        position: 'top-center',
        duration: 11000
      });

      setTimeout(() => {
        SETopenAllowed(true);
      }, 10000);
    }
  };

  return (
    <main>
      <button
        className='garageBtn'
        onClick={handleGarageBtnClick}
        disabled={!openAllowed}></button>
    </main>
  );
}

function LoginPage({
  auth,
  SETauth
}: {
  auth: boolean;
  SETauth: boolSetState;
}) {
  if (auth) window.location.reload();
  const [submitAllowed, SETsubmitAllowed] = React.useState(true);

  let submitSpam = 0;
  let timeouts: number[] = [];

  const handleSubmit = function (e: React.FormEvent | any) {
    /*
    using any as the type because ts is saying .password doesnt exist on e.target
    because it is the name of the input 
    */
    ('use server');

    e.preventDefault();

    let userInput = e.target.password.value;
    userInput = userInput.toLowerCase();

    if (AUTH_PASSWORDS.includes(userInput)) {
      SETauth(true);
      localStorage.setItem('authorized', 'true');

      toast.success('You are Authorized !');
    } else {
      toast.error(`Incorrect Password "${userInput}"`);
      submitSpam++;

      if (submitSpam > 4 && submitSpam < 10) {
        timeouts.push(
          setTimeout(() => {
            submitSpam = 0;

            //clear all timeouts after 7 seconds except the final warning one
            timeouts.forEach((id) => {
              clearTimeout(id);
            });
          }, 7000)
        );
      } else if (submitSpam >= 10) {
        SETsubmitAllowed(false);

        toast.loading('Try again in 20 seconds', {
          position: 'top-center',
          duration: 22000
        });
        toast.error('Too many Incorrect Passwords Attempts', {
          position: 'top-center',
          duration: 12000
        });

        setTimeout(() => {
          SETsubmitAllowed(true);
        }, 30000);
      }
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit} className='passForm'>
        <input
          type='text'
          name='password'
          placeholder='PASSWORD'
          className='passInput'
        />
        <button type='submit' className='submitBtn' disabled={!submitAllowed}>
          Submit
        </button>
      </form>
    </main>
  );
}
