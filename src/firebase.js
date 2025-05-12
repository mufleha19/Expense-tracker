import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDeP6FwogRse7t_1Fws_n2YU5EEgmWqvYQ",
  authDomain: "expense-tracker-e6541.firebaseapp.com",
  databaseURL: "https://expense-tracker-e6541-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "expense-tracker-e6541",
  storageBucket: "expense-tracker-e6541.firebasestorage.app",
  messagingSenderId: "987305771954",
  appId: "1:987305771954:web:bcd6ddd1265f5156c85aab"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);