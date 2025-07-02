// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2_QFNF0mbVx4ZaY4k2GQi7PNO-qzt-Vo",
  authDomain: "ultinvoice.firebaseapp.com",
  projectId: "ultinvoice",
  storageBucket: "ultinvoice.firebasestorage.app",
  messagingSenderId: "233294142345",
  appId: "1:233294142345:web:d62b4a1ab66704ee069f58",
  measurementId: "G-3N2VBYGF9L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export default app;
export { analytics };
