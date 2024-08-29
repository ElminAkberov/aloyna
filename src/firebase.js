import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyAay1qzAskIK89BRFVlz0zTxApKDkLS-hY",
    authDomain: "post-5b0b4.firebaseapp.com",
    projectId: "post-5b0b4",
    storageBucket: "post-5b0b4.appspot.com",
    messagingSenderId: "1091069659837",
    appId: "1:1091069659837:web:fd4bc4a37e07a47a7105d4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);
export const storage = getStorage(app)
