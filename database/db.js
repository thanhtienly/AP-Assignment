import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
