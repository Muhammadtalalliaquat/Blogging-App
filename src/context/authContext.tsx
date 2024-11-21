"use client";

import { app, db } from "@/firebase/firebaseconfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type childrenType = {
  children: ReactNode;
};
type userType = {
  email: string | null;
  uid: string;
  emailVerified: boolean;
  role?: string
};

type authContextType = {
  user: userType | null;
};

const AuthFormContext = createContext<authContextType | null>(null);

export function AuthFormContextProvider({ children }: childrenType) {
  const [user, setUser] = useState<userType | null>(null);
  
  const router = useRouter();
  // const pathname = usePathname();

  const fetchUserRole = async (uid: string) => {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.role; 
        }
    } catch (error) {
        console.error("Error fetching user role:", error);
    }
    return null;
};

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // console.log("🚀 ~ onAuthStateChanged ~ user:", updatedUsers);
        const { email, uid, emailVerified } = user;
        const role = await fetchUserRole(uid);
        const updatedUsers = { email, uid, emailVerified , role };
        setUser(updatedUsers);

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
        }

      } else {
        console.log(`inside onauthstatechange else statemnet`);
        setUser(null);
        router.push("/get-started");
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthFormContext.Provider value={{ user }}>
      {children}
    </AuthFormContext.Provider>
  );
}

// eslint-disable-next-line react-hooks/rules-of-hooks
export const authContextData = () => useContext(AuthFormContext);
