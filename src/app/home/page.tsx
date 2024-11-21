"use client";

import { collection, DocumentData, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "../all-post/main.module.css";
import { db } from "@/firebase/firebaseconfig";
import NavBar from "@/components/navBar";
import Footer from "@/components/footer";
import Link from "next/link";

export default function HomePage() {
  const [allPost, setAllPost] = useState<DocumentData[]>([]);
  const [Loading, setLoading] = useState(false);

  const fetcLoadingData = () => {
    setTimeout(() => {
      setLoading(true);
    }, 2000);
  };

  useEffect(() => {
    fetcLoadingData();
    fetchPostData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPostData = async () => {
    const collectionRef = collection(db, "posts");
    const postData = await getDocs(collectionRef);
    const allPostData = postData.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAllPost(allPostData);
  };

  return (
    <>
      {Loading ? (
        <>
          <NavBar />
          <h1 className={styles.h1_heading}>All Posts Here</h1>
          <br />

          <div className={styles.posts}>
            {allPost.length > 0 ? (
              <div>
                {allPost.map(({ title, content, tags, id }, index) => (
                  <div key={index} className={styles.post}>
                    <div className={styles.title_date_contanier}>
                      <h2
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          margin: "0px",
                        }}
                      >
                        {title}
                      </h2>
                    </div>
                    <p>
                      <b>Content: </b>
                      {content.length > 200
                        ? content.substring(0, 200) + `...`
                        : content}
                    </p>
                    <div className={styles.tagsAndButtons}>
                      <span className={styles.tags}>Tags: {tags}</span>

                      <Link href={`/post-details/${id}`}>
                        <span
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            cursor: "pointer",
                          }}
                        >
                          more detalis
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.no_posts}>
                <p>No posts available.</p>
              </div>
            )}
          </div>

          <Footer />
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "90vh",
          }}
        >
          <span id={styles.loader} className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </>
  );
}
