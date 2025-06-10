import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBmevCCnGgyLWESAbg9SNXBzt-dATCPIR8",
  authDomain: "sasgl-1724b.firebaseapp.com",
  projectId: "sasgl-1724b",
  storageBucket: "sasgl-1724b.firebasestorage.app",
  messagingSenderId: "379751174566",
  appId: "1:379751174566:web:7e628e853f43ecf4857f67",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { storage, auth, provider };
