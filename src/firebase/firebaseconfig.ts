import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_apiKey,
      authDomain: process.env.NEXT_PUBLIC_authDomain,
      projectId: process.env.NEXT_PUBLIC_projectId,
      storageBucket: process.env.NEXT_PUBLIC_storageBucket,
      messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
      appId: process.env.NEXT_PUBLIC_appId,
      measurementId: process.env.NEXT_PUBLIC_measurementId

}
  export const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  export const storage = getStorage(app);
//   const analytics = getAnalytics(app);
