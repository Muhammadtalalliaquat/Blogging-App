import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  Auth,
  User,
} from "firebase/auth";
import { app, db } from "@/firebase/firebaseconfig";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { doc, getDoc } from "firebase/firestore";
import saveUser from "./firebasestore";

export const auth = getAuth(app);

export function SignupForm(
  email: string,
  password: string,
  router: AppRouterInstance,
  setError: (message: string) => void
) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // const user = userCredential.user;
      const { email, uid, emailVerified } = userCredential.user;
      sendEmailVerification(auth.currentUser as User);
      console.log("user created successfully.");
      saveUser({ email: email as string, uid, emailVerified });
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      }
      console.error("Error during signup:", error.message);
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // console.error(errorMessage, "invild email or password.");
      // alert("invild email or password.");
      // ..
    });
}

export function loginForm(
  email: string,
  password: string,
  router: AppRouterInstance,
  setError: (message: string) => void
) {
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const { emailVerified, uid } = userCredential.user;

      try {
        const userDoc = await getDoc(doc(db, "users", uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData?.role;

          if (emailVerified) {
            if (role === "admin") {
              router.push("/AdminDashBorad");
            } else {
              router.push("/home");
            }
          } else {
            router.push("/emailverify");
          }
        } else {
          console.error("User data not found in Firestore.");
          setError("User data not found. Please contact support.");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setError("An error occurred while fetching user data.");
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (errorCode === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
        alert("Incorrect password. Please try again.");
      }
      console.error("Login error:", error.message);
    });
}

export function emailVerification() {
  const auth = getAuth(app);
  sendEmailVerification(auth.currentUser as User).then((success) => {
    console.log(success, "Email verifcation send successfully");
  });
}

export function signOutUser(auth: Auth) {
  signOut(auth)
    .then(() => {
      console.log("Sign-out successful.");
    })
    .catch((error) => {
      console.log(error, " An error happened");
      alert("already signin out");
    });
}
