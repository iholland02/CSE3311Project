import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyBlcbdqepyV700M3No7S89lGMzF8mwTEr8",
    authDomain: "boardr-app.firebaseapp.com",
    projectId: "boardr-app",
    storageBucket: "boardr-app.appspot.com",
    messagingSenderId: "219080293447",
    appId: "1:219080293447:web:c09ffccc99601eec354562",
    measurementId: "G-L82PK9B5Y9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

// Export the auth-related functions
export { auth, provider, signInWithPopup, signOut, analytics };
