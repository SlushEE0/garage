import React from 'react';

import toast from 'react-hot-toast';

import { boolSetState } from '../lib/types';
import * as SECRETS from '../lib/secrets';

import './App.css';

const ESPHOME_API_URL = 'https://esphome.webredirect.org/api/garage';

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
              'X-RapidAPI-Key': SECRETS.GEOCODING_KEY,
              'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
            }
          }
        )
          .then((res) => res.json())
          .then((res) => res.address.postcode);

        if (SECRETS.VALID_ZIPS.includes(zipCode)) {
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
  const [force, SETforce] = React.useState(false);
  let API_URL = ESPHOME_API_URL;

  let toastAlerts: any = {};

  let openRequests = 0;
  let timeouts: number[] = [];


  const dev = function (key: string, params?: any[]) {
    if (SECRETS.DEV_KEYS.includes(key)) {
      SECRETS.DEV_FUNCS(key, params);
    }
  };
  dev('');

  const handleGarageBtnClick = async function () {
    const timeout = setTimeout(() => {
      toast.error('Something went wrong');
    }, 5000);

    const resp = await fetch(`${API_URL}`, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...({ auth: SECRETS.ESPHOME_KEY } && (force ? { force: 6000 } : null))
      }),
      method: 'PUT'
    })
      .then(() => {
        clearTimeout(timeout);
      })
      .catch((err) => {
        toast.error(err);
        console.error(err);
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

  const handleForceToggle = function (e: React.MouseEvent) {
    if (force) {
      (e.target as HTMLButtonElement).style.color = 'red';
      console.log((e.target as HTMLButtonElement).style.color);

      toast.remove(toastAlerts?.forceAlert);
    } else {
      (e.target as HTMLButtonElement).style.color = 'green';
      console.log((e.target as HTMLButtonElement).style.color);

      toastAlerts = {
        ...toastAlerts,
        forceAlert: toast.success('Force Open/Close enabled', {
          position: 'bottom-right',
          duration: Math.pow(2, 21)
        })
      };
    }

    SETforce(!force);
  };

  return (
    <main>
      <button onClick={handleForceToggle} className='toggleForceBtn'>
        {force ? 'ON' : 'OFF'}
      </button>

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

  const handleSubmit = function (e: React.FormEvent) {
    /*
    using any as the type because ts is saying .password doesnt exist on e.target
    */
    ('use server');

    e.preventDefault();

    let userInput = (e.target as HTMLFormElement).password.value;
    userInput = userInput.toLowerCase();

    if (SECRETS.AUTH_PASSWORDS.includes(userInput)) {
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
