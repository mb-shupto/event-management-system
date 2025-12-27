import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Replace with your actual Firebase config from the console
const firebaseConfig = {
  apiKey: "AIzaSyC4glbcdBEZ0AOX3hcYOizFJdPnDVZ90tE",
  authDomain: "event-management-system-15470.firebaseapp.com",
  projectId: "event-management-system-15470",
  storageBucket: "event-management-system-15470.firebasestorage.app",
  messagingSenderId: "296319908740",
  appId: "1:296319908740:web:6087455bcf3a6fe24efbd1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the initialized services
export const db = getFirestore(app);
export const auth = getAuth(app);