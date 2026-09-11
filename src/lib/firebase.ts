import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  Auth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadString,
  uploadBytes,
  getDownloadURL,
  FirebaseStorage,
} from 'firebase/storage';
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID && import.meta.env.VITE_FIREBASE_DATABASE_ID !== '(default)' 
  ? import.meta.env.VITE_FIREBASE_DATABASE_ID 
  : undefined;

console.log('[Firebase] Connected to project:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

// Initialize or reuse Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with offline persistence support
let firestoreInstance: Firestore;
try {
  firestoreInstance = firestoreDatabaseId
    ? initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      }, firestoreDatabaseId)
    : initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
} catch {
  // If already initialized or if multi-tab fails, get existing instance
  firestoreInstance = firestoreDatabaseId ? getFirestore(app, firestoreDatabaseId) : getFirestore(app);
}

export const db: Firestore = firestoreInstance;
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Explicitly ensure browserLocalPersistence is set for robust session management
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('[Firebase Auth] browserLocalPersistence setting note:', err);
});

// Test connection on boot (Skill guideline)
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore: the client is currently offline. Offline cache will be used.');
    }
  }
}
testConnection();

/**
 * Uploads a product image or artisan photo to Firebase Storage.
 * Supports File, Blob, or base64 data URLs.
 * Gracefully falls back to the original image string if offline or storage unavailable.
 */
export async function uploadProductImage(
  imageInput: File | Blob | string,
  folder: 'products' | 'avatars' = 'products'
): Promise<string> {
  try {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const storagePath = `${folder}/${timestamp}_${randomId}.jpg`;
    const imageRef = ref(storage, storagePath);

    if (typeof imageInput === 'string') {
      if (imageInput.startsWith('data:')) {
        await uploadString(imageRef, imageInput, 'data_url');
        const downloadUrl = await getDownloadURL(imageRef);
        return downloadUrl;
      }
      return imageInput;
    } else {
      await uploadBytes(imageRef, imageInput, { contentType: 'image/jpeg' });
      const downloadUrl = await getDownloadURL(imageRef);
      return downloadUrl;
    }
  } catch (error) {
    console.warn('[Firebase Storage] Image upload fallback:', error);
    if (typeof imageInput === 'string') {
      return imageInput;
    }
    return '';
  }
}
