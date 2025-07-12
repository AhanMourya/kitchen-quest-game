// Firebase core and service imports
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// --- Firebase configuration ---
// To enable Google Auth, go to Firebase Console > Auth > Sign-in method > Enable Google
// This config connects your app to your Firebase project
const firebaseConfig = {
    apiKey: "AIzaSyAq2C3_6puLpnS-ftp45HrZJeH8VLYwv04",
    authDomain: "kitchen-quest-game.firebaseapp.com",
    projectId: "kitchen-quest-game",
    storageBucket: "kitchen-quest-game.appspot.com",
    messagingSenderId: "466208823993",
    appId: "1:466208823993:web:0e328d8dba87c09b42d968",
    measurementId: "G-FNSWXLECHE"
};

// --- Initialize Firebase services ---
// app: main Firebase app instance
const app = initializeApp(firebaseConfig);
// auth: Firebase Authentication instance
const auth = getAuth(app);
// db: Firestore database instance
const db = getFirestore(app);
// provider: Google Auth provider for sign-in
const provider = new GoogleAuthProvider();

// --- Auth helpers ---
// signInWithGoogle: Opens Google sign-in popup
const signInWithGoogle = () => signInWithPopup(auth, provider);
// signOutUser: Signs out the current user
const signOutUser = () => signOut(auth);

// --- XP/Level Firestore helpers ---
// getUserProfile: Fetches the user's XP/level profile from Firestore.
//   - If the profile does not exist, creates a default one.
//   - User data is stored at users/{uid}/profile/main
async function getUserProfile(uid) {
  const ref = doc(db, "users", uid, "profile", "main");
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
  // If not found, create default profile
  const defaultProfile = { xp: 0, level: 1, xpToNextLevel: 400 };
  await setDoc(ref, defaultProfile);
  return defaultProfile;
}

// updateUserXPLevel: Updates the user's XP, level, and XP-to-next-level in Firestore.
//   - Uses setDoc with merge:true so it works even if the doc doesn't exist yet
async function updateUserXPLevel(uid, newXP, newLevel, newXpToNextLevel) {
  const ref = doc(db, "users", uid, "profile", "main");
  await setDoc(ref, { xp: newXP, level: newLevel, xpToNextLevel: newXpToNextLevel }, { merge: true });
}

// Export all helpers and Firebase instances for use in the app
export { auth, signInWithGoogle, signOutUser, db, getUserProfile, updateUserXPLevel };
