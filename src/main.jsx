import React from 'react';
import { Toaster } from 'react-hot-toast';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css';
import { getUsers } from '../lib/firebase.js';

(async () => {
  const UsersArr = await getUsers();

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Toaster position='bottom-left' reverseOrder={false} />
      <App UsersArr={UsersArr} />
    </React.StrictMode>
  );
})();
