import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Import the Firebase configuration
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// Use the named database if provided
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

let storageInstance;
try {
  // Try to initialize storage. If it fails, we'll handle it gracefully.
  // Some environments might not have the storage service enabled.
  // Explicitly passing the bucket URL can sometimes help.
  const bucketUrl = firebaseConfig.storageBucket ? 
    (firebaseConfig.storageBucket.startsWith('gs://') ? 
      firebaseConfig.storageBucket : 
      `gs://${firebaseConfig.storageBucket}`) : 
    undefined;
    
  storageInstance = getStorage(app, bucketUrl);
} catch (error) {
  console.warn("Firebase Storage is not available. Photo uploads will be disabled.", error);
  storageInstance = null;
}

export const storage = storageInstance;
export const googleProvider = new GoogleAuthProvider();
