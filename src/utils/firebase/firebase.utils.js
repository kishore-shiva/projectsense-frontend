import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBOkSh1tp6XUtj8u-q2FemBeiM78JJnYPM",
  authDomain: "projectsense-148f5.firebaseapp.com",
  projectId: "projectsense-148f5",
  storageBucket: "projectsense-148f5.appspot.com",
  messagingSenderId: "882974289375",
  appId: "1:882974289375:web:90f112a6bdedeaab69686a"
};

export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const db = getFirestore()

const provider = new GoogleAuthProvider()
provider.setCustomParameters({
  'prompt': 'select_account'
})

export const signInWIthGoooglePopup = async () => await signInWithPopup(auth, provider)

export const onAuthStateChangeListener = (callback) => onAuthStateChanged(auth, callback)

export const signOutFromApp = () => signOut(auth)

export const checkSubscription = async (userId) => {
  if (userId != null) {
    const documentRef = doc(db, "customers", userId);
    const userSnapshot = await getDoc(documentRef);

    return userSnapshot.exists();
  } else {
    return null;
  }
}