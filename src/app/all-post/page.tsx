"use client";

import Image from "next/image";
import NavBar from "@/components/navBar";
import { auth } from "@/firebase/firebaseauth";
import { db } from "@/firebase/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  Timestamp,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import style from "../all-post/main.module.css";
import { delectPostItems } from "@/firebase/firebasestore";
import Link from "next/link";

type userType = {
  email: string | null;
  uid: string;
  emailVerified: boolean;
};

export default function FetchAllPost() {
  const [allPost, setAllPost] = useState<DocumentData[]>([]);
  const [user, setUser] = useState<null | userType>(null);

  let readRealTimeListner: Unsubscribe | null = null;

  useEffect(() => {
    const detchOnAuthSateListner = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchExpnseRealTime(currentUser.uid);
        setUser(currentUser);
      } else {
        console.log(user, "user not found");
        setUser(null);
        setAllPost([]);
      }
    });

    return () => {
      if (readRealTimeListner) {
        console.log("Component Unmount");
        readRealTimeListner();
      }
      detchOnAuthSateListner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchExpnseRealTime = (userID: string) => {
    const collectionRef = collection(db, "posts");
    const condition = where("author", "==", userID);
    const q = query(collectionRef, condition);

    const allPostClone = [...allPost];

    readRealTimeListner = onSnapshot(
      q,
      (snapshot) => {
        // console.log("🚀 ~ fetchExpnseRealTime ~ snapshot:", snapshot);
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const postData = change.doc.data();
            postData.id = change.doc.id;
            allPostClone.push(postData);
            setAllPost([...allPostClone]);
            console.log(change.type, allPostClone, "inside home");
          }
          if (change.type === "modified") {
            const postData = change.doc.data();
            postData.id = change.doc.id;

            const indexToUpdate = allPostClone.findIndex(
              (post) => post.id === postData.id
            );

            if (indexToUpdate !== -1) {
              allPostClone[indexToUpdate] = postData;
              setAllPost([...allPostClone]);
            }
            console.log("Modified post: ", postData);
          }
          if (change.type === "removed") {
            const postData = change.doc.data();
            postData.id = change.doc.id;

            const indexToRemove = allPostClone.findIndex(
              (post) => post.id === postData.id
            );

            if (indexToRemove !== -1) {
              allPostClone.splice(indexToRemove, 1);
              setAllPost([...allPostClone]);
            }
            console.log("Removed post: ", postData);
          }
        });
      },
      (err) => {
        console.warn(err);
      }
    );
  };

  const formateDate = useCallback(
    (timestamp: Timestamp | null | undefined): string => {
      if (
        !timestamp ||
        typeof timestamp !== "object" ||
        typeof timestamp.seconds !== "number"
      ) {
        return "Date not available";
      }

      const date = new Date(timestamp.seconds * 1000);

      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    []
  );

  return (
    <>
      <NavBar />
      <h1 className={style.h1_heading}>All Posts Here</h1>
      <br />

      <div className={style.posts}>
        {allPost.length > 0 ? (
          <div>
            {allPost.map(
              (
                { title, content, tags, imageUrl, createdAt, lastEditedAt, id },
                index
              ) => (
                <div key={index} className={style.post}>
                  <div className={style.title_date_contanier}>
                    <div className={style.title_post}>
                      <h2
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          margin: "0px",
                        }}
                      >
                        {title}
                      </h2>

                      {lastEditedAt ? (
                        <p style={{ fontSize: "11px", color: "#888" }}>
                          edit post on: {formateDate(lastEditedAt)}
                        </p>
                      ) : (
                        <p style={{ fontSize: "11px" }}>
                          Posted on: {formateDate(createdAt)}
                        </p>
                      )}
                    </div>
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={`Image for ${title}`}
                        width={600}
                        height={400}
                        className={style.postImage}
                        priority
                      />
                    )}
                  </div>
                  <p>
                    <b>Content: </b>
                    {content}
                  </p>
                  <div className={style.tagsAndButtons}>
                    <span className={style.tags}>Tags: {tags}</span>
                    <div>
                      <Link href={`/editPost/${id}`}>
                        <button className={`${style.button} ${style.edit}`}>
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          delectPostItems(id);
                        }}
                        className={`${style.button} ${style.delete}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className={style.no_posts}>
            <p>No posts available.</p>
          </div>
        )}
      </div>
    </>
  );
}
