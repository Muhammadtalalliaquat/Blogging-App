"use client";

import { useEffect } from "react";
import { auth } from "@/firebase/firebaseauth";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { app } from "@/firebase/firebaseconfig";
import { authContextData } from "@/context/authContext";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import React from "react";
import Link from "next/link";
const db = getFirestore(app);

export default function emailVerification() {
  const { user } = authContextData()!;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const detchOnAuthSateListner = onAuthStateChanged(auth, (user) => {
      if (user) {
        userVerify();
      }
    });

    return () => {
      if (readRealTimeListner) {
        console.log("Component Unmount");
        readRealTimeListner();
        detchOnAuthSateListner();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let readRealTimeListner: Unsubscribe;

  const userVerify = () => {
    const collectionRef = collection(db, "users");
    const currentUser = auth.currentUser?.uid;
    const condition = where("uid", "==", currentUser);

    const q = query(collectionRef, condition);

    readRealTimeListner = onSnapshot(q, (UserSnapshot) => {
      UserSnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
        }
        if (change.doc.exists()) {
        }
        if (change.type === "removed") {
        }
      });
    });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
          Check Your Inbox!
        </h2>
        <br />
        <p style={{ fontSize: "16px", color: "#555", marginBottom: "10px" }}>
          Please verify your email
        </p>
        <span
          style={{ color: "#1a73e8", fontWeight: "bold", fontSize: "14px" }}
        >
          <Link href="https://mail.google.com/mail/u/0/#inbox" target="_blank">
            {user?.email}
          </Link>
        </span>
      </div>
    </>
  );
}
