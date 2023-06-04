import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

interface Answers {
  word: string;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function getRandomAnswer(setAnswer: (value: string) => void) {
  const answers: Answers[] = [];
  const querySnapshot = await getDocs(collection(db, 'Words'));
  querySnapshot.forEach((doc) => answers.push(doc.data() as Answers));
  const randomIndex: number = Math.floor(Math.random() * answers.length);
  const randomAnswer = answers[randomIndex].word;
  setAnswer(randomAnswer);
}
