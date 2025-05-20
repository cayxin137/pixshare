// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCdl8iAWn2TSfQl2ODXr24UQQgaM3SgJ1w",
    authDomain: "pixshare-10165.firebaseapp.com",
    projectId: "pixshare-10165",
    storageBucket: "pixshare-10165.appspot.com",
    messagingSenderId: "567567915729",
    appId: "1:567567915729:web:a34f38686bae23873583f0",
    measurementId: "G-EPKB3057B1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);