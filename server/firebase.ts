// server/firebase.ts
import admin from "firebase-admin";

function getServiceAccount() {
  const raw = process.env.FIREBASE_CREDENTIALS || "";
  const b64 = process.env.FIREBASE_CREDENTIALS_B64 || "";
  const jsonText = raw ? raw : (b64 ? Buffer.from(b64, "base64").toString("utf-8") : "");
  
  if (!jsonText) throw new Error("FIREBASE_CREDENTIALS missing");
  return JSON.parse(jsonText);
}

const databaseURL =
  process.env.FIREBASE_DB_URL ||
  "https://laroza-8b3ad-default-rtdb.firebaseio.com/"; // explicit RTDB URL as requested

// Only initialize Firebase in production or when credentials are available
let rtdb: admin.database.Database;

if (process.env.NODE_ENV !== "development") {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(getServiceAccount()),
      databaseURL,
    });
  }
  rtdb = admin.database();
} else {
  // Create a mock database for development
  rtdb = {} as admin.database.Database;
  console.warn("Firebase not initialized in development mode - using memory storage instead");
}

export { rtdb };