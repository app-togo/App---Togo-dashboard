import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyApwBMFhVafikHF7WqMqTrp7_1vqKij6Xs",
    authDomain: "app-togo-180c8.firebaseapp.com",
    projectId: "app-togo-180c8",
    storageBucket: "app-togo-180c8.firebasestorage.app",
    messagingSenderId: "1017213412914",
    appId: "1:1017213412914:web:f51f5e226d31a422aa3e2b"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Provider to request specific scopes
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  'login_hint': 'user@example.com'
});

export { app, auth, googleProvider };
