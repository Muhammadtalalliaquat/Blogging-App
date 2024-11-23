"use client";

import Image from "next/image";
import NavBar from "@/components/navBar";
import { db } from "@/firebase/firebaseconfig";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import style from "../../all-post/main.module.css";
import { auth } from "@/firebase/firebaseauth";
import Footer from "@/components/footer";

type userType = {
  email: string | null;
  uid: string;
  emailVerified: boolean;
};

export default function PostDetails({
  params: { id },
}: {
  params: { id: string };
}) {
  console.log(id);
  const [post, setPost] = useState<DocumentData | null>(null);
  const [comment, setComments] = useState("");
  const [newComment, setNewComment] = useState<DocumentData[]>([]);
  const [authenticated, setAuthenticated] = useState<boolean | userType>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Loading, setLoading] = useState(false);

  const fetcLoadingData = () => {
    setTimeout(() => {
      setLoading(true);
    }, 2000);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(user);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetcLoadingData();
    fetchPost();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPost = async () => {
    if (id) {
      try {
        const docRef = doc(db, "posts", id);
        const postData = await getDoc(docRef);
        if (postData.exists()) {
          setPost(postData.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching post: ", error);
      }
    }
  };

  const addComment = async () => {
    if (!comment) return;
    setIsSubmitting(true);
    try {
      const commetCollectRef = collection(db, "posts", id, "comments");
      await addDoc(commetCollectRef, {
        text: comment,
        createdAt: serverTimestamp(),
        userId: auth.currentUser?.uid,
        userEmail: auth.currentUser?.email,
      });
      setComments("");
      fetchComments();
    } catch (error) {
      console.log("Error adding comment: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchComments = async () => {
    try {
      const commentCollectionRef = collection(db, "posts", id, "comments");
      const commentsSnapshot = await getDocs(commentCollectionRef);
      const commentsData = commentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewComment(commentsData);
      console.log("Fetched comments:", commentsData);
    } catch (error) {
      console.error("Error fetching comments: ", error);
    }
  };

  return (
    <>
      <NavBar />

      {Loading ? (
        <>
          <h1 className={style.h1_heading}>Blog Post</h1>
          <br />
          <div className={style.posts}>
            {post ? (
              <>
                <div className={style.post}>
                  <div className={style.title_date_contanier}>
                    <div className={style.title_post}>
                      <h2
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          margin: "0px",
                        }}
                      >
                        {post.title}
                      </h2>

                      {post.lastEditedAt ? (
                        <p style={{ fontSize: "11px", color: "#888" }}>
                          edit post on:{" "}
                          {post.lastEditedAt.toDate().toLocaleDateString()}
                        </p>
                      ) : (
                        <p style={{ fontSize: "11px" }}>
                          Posted on:{" "}
                          {post.createdAt.toDate().toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {post.imageUrl && (
                      <Image
                        src={post.imageUrl}
                        alt={`Image for ${post.title}`}
                        width={600}
                        height={400}
                        className={style.postImage}
                        priority
                      />
                    )}
                  </div>

                  <p>
                    <b>Content: </b>
                    {post.content}
                  </p>

                  <div className={style.tagsAndButtons}>
                    <span className={style.tags}>Tags: {post.tags}</span>
                  </div>
                </div>

                {authenticated ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "7px",
                        padding: "5px",
                      }}
                    >
                      <input
                        type="text"
                        value={comment}
                        placeholder="comment here"
                        onChange={(e) => setComments(e.target.value)}
                        className="input input-bordered w-full"
                      />

                      <button
                        onClick={addComment}
                        className="btn btn-outline btn-success"
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                          height: "40px",
                        }}
                      >
                        {isSubmitting ? "Saving..." : "Submit comment"}
                      </button>
                    </div>

                    <div
                      className="dropdown"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#f9f9f9",
                        border: "1px solid #e0e0e0",
                        borderRadius: "5px",
                        padding: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <div tabIndex={0} role="button" className="btn m-1">
                        Comments
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content"
                        style={{
                          width: "100%",
                          height: "150px",
                          backgroundColor: "white",
                          paddingLeft: "20px",
                          paddingRight: "20px",
                          paddingTop: "10px",
                          overflowY: "scroll",
                          overflowX: "hidden",
                        }}
                      >
                        {newComment.length > 0 ? (
                          newComment.map(
                            ({ text, createdAt, userEmail }, index) => (
                              <li
                                key={index}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  padding: "12px",
                                  marginBottom: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #e0e0e0",
                                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                  backgroundColor: "#fff",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Image
                                    width={30}
                                    height={30}
                                    alt="User Avatar"
                                    src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
                                    style={{
                                      borderRadius: "50%",
                                      marginRight: "10px",
                                      border: "2px solid #22afe3",
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: "#333",
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {userEmail}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    backgroundColor: "#f2f3f5",
                                    padding: "10px",
                                    marginTop: "5px",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: " #000000",
                                      fontSize: "14px",
                                      fontWeight: "lighter",
                                    }}
                                  >
                                    {text}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#888",
                                      textAlign: "right",
                                    }}
                                  >
                                    {createdAt.toDate().toLocaleDateString()}
                                  </span>
                                </div>
                              </li>
                            )
                          )
                        ) : (
                          <li
                            style={{
                              color: "#888",
                              fontStyle: "italic",
                              padding: "10px",
                              textAlign: "center",
                              backgroundColor: "#f0f0f0",
                              borderRadius: "4px",
                            }}
                          >
                            No comments available
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                ) : (
                  <p
                    className={style.p}
                    style={{
                      color: "#555",
                      backgroundColor: "#f9f9f9",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      fontSize: "14px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      width: "fit-content",
                      margin: "10px auto",
                    }}
                  >
                    Please log in to add a comment.
                  </p>
                )}
              </>
            ) : (
              <p
                style={{
                  color: "#555",
                  backgroundColor: "#f9f9f9",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  fontSize: "14px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  width: "fit-content",
                  margin: "10px auto",
                }}
              >
                Loading post details...
              </p>
            )}
          </div>

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
          <span
            id={style.loader}
            className="loading loading-spinner loading-lg"
          ></span>
        </div>
      )}

      <br />
      <br />
      <Footer />
    </>
  );
}
