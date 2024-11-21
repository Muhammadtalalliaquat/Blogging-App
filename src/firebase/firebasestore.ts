"use cilent";

import { addDoc, collection, deleteDoc, doc, getFirestore, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { app } from "./firebaseconfig";
import { auth } from "./firebaseauth";

const db = getFirestore(app);

type UserType = {
  email: string;
  uid: string;
  emailVerified: boolean;
};

export default async function saveUser(user: UserType) {
  try {
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, user);
  } catch (error) {
    console.log(error);
  }
}



export async function CreatePost(title: string, content: string, tags:string, slug: string) {


  const collectionRef = collection(db , "posts");
  const userUID = auth.currentUser?.uid;
  const createPostUser = {
    title,
    content,
    slug,
    tags: tags.split(","),
    // createdAt: new Date().toISOString(),
    createdAt: Timestamp.fromDate(new Date()),
    author: userUID,
  };

  try {
    const docRef = await addDoc(collectionRef, createPostUser);
    const docRefToUpdate = doc(db, "posts", docRef.id);
    await updateDoc(docRefToUpdate, {
      firebaseID: docRef.id,
    });
    return docRef.id;
  } catch (error) {
    console.log(error);
    return null;
  }
}


export async function delectPostItems(firebaseID: string) {
  try {
    const postRef = doc(db, "posts", firebaseID);
    await deleteDoc(postRef);
    
  } catch (error) {
    console.log(error, "delect-Post-items");
  }
}

