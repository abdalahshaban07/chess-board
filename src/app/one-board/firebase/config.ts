// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyCyQtYvK5BehQjp6xGIqwvqiAj-AIvqX9Q',
  authDomain: 'chess-board-5380b.firebaseapp.com',
  projectId: 'chess-board-5380b',
  storageBucket: 'chess-board-5380b.appspot.com',
  messagingSenderId: '899562952770',
  appId: '1:899562952770:web:7fed0680c656c71972b5db',
  measurementId: 'G-VMX9Y44ZE1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
