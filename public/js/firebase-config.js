import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDyihcFbEr7rgyoF8WhArGK_VEAunjFfjo',
  authDomain: 'diploma-project-442315.firebaseapp.com',
  projectId: 'diploma-project-442315',
  storageBucket: 'diploma-project-442315.firebasestorage.app',
  messagingSenderId: '330818862501',
  appId: '1:330818862501:web:e86c06c90740a94d597c4c',
  measurementId: 'G-S523KR5KDG',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics, logEvent };
