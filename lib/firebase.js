import firebase from 'firebase/compat/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const FBConfig = {
  apiKey: 'AIzaSyDI04e7u2jaeyjvjZTZCyits0KeMI6KKIk',
  authDomain: 'garageopener-27000.firebaseapp.com',
  databaseURL: 'https://garageopener-27000-default-rtdb.firebaseio.com',
  projectId: 'garageopener-27000',
  storageBucket: 'garageopener-27000.appspot.com',
  messagingSenderId: '1066651715164',
  appId: '1:1066651715164:web:b16a994346ad5fc20e8899',
  measurementId: 'G-YSQX2FQCZX'
};
const app = firebase.initializeApp(FBConfig);
const db = getFirestore(app);

export const getUsers = async function () {
  const querySnapshot = await getDocs(collection(db, 'users'));
  const UsersArr = querySnapshot.docs.map((doc) => {
    return doc.id;
  });

  return UsersArr;
};
