import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAq2C3_6puLpnS-ftp45HrZJeH8VLYwv04",
    authDomain: "kitchen-quest-game.firebaseapp.com",
    projectId: "kitchen-quest-game",
    storageBucket: "kitchen-quest-game.firebasestorage.app",
    messagingSenderId: "466208823993",
    appId: "1:466208823993:web:0e328d8dba87c09b42d968",
    measurementId: "G-FNSWXLECHE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => signInWithPopup(auth, provider);

const signOutUser = () => signOut(auth);

export { auth, signInWithGoogle, signOutUser };
