"use client";

import NavBar from "@/components/navBar";
import { db, storage } from "@/firebase/firebaseconfig";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
// import { console } from "inspector";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactMde from "react-mde";
import Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import style from "../../../components/main.module.css";
import Footer from "@/components/footer";

type PostType = {
  title: string;
  content: string;
  tags: string;
  sulg: string;
  lastEditedAt?: Timestamp;
};

export default function EditPosts({
  params: { postID },
}: {
  params: { postID: string };
}) {
  const converter = new Showdown.Converter();

  const [posts, setPosts] = useState<PostType | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [slug, setSlug] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [picture, setPicture] = useState<File>();
  const [error, setError] = useState("");
  const [msgError, setMsgError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (postID) {
      const fetchPostData = async () => {
        try {
          const postDataRedf = doc(db, `posts`, postID);
          const postSnap = await getDoc(postDataRedf);
          if (postSnap.exists()) {
            const postData = postSnap.data() as PostType;
            setPosts(postData || "");
            setTitle(postData.title || "");
            setContent(postData.content || "");
            setSlug(postData.sulg || "");
            setTags(postData.tags || "");
          } else {
            setError("Post not found");
            console.log(error, "post not found");
          }
        } catch (error) {
          setError("Failed to fetch Post");
          console.log(error);
        }
      };
      fetchPostData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postID]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !content || !tags || picture) {
      setMsgError("Make sure to fill in all the necessary fields.");
      console.log(msgError, "Error: All fields are required.");
      return;
    }

    if (postID) {
      uploadImage(postID);
      // router.push("/all-post");
    } else {
      console.error("Failed to create post");
    }
    setMsgError(null);
    setIsSubmitting(true);

    if (title && content && tags && slug) {
      if (posts) {
        try {
          const postDataRef = doc(db, `posts`, postID as string);
          await updateDoc(postDataRef, {
            title,
            content,
            slug,
            tags,
            lastEditedAt: serverTimestamp(),
          });
          console.log("Post updated successfully");
          router.push("/all-post");
        } catch (error) {
          console.log(error, "Failed to update post");
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const generateSlug = useCallback((title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleValue = e.target.value;
    setTitle(titleValue);
    setSlug(generateSlug(titleValue));
  };

  const uploadImage = (postId: string) => {
    if (!picture) {
      console.error("No picture provided");
      return;
    }

    const storageRef = ref(storage, `images/${makeImageName()}`);
    const uploadTask = uploadBytesResumable(storageRef, picture);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload failed:", error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("File available at", downloadURL);
            saveImageFireStore(postId, downloadURL);
          })
          .catch((error) => {
            console.error("Failed to get download URL:", error.message);
          });
      }
    );
  };

  const makeImageName = () => {
    const imageName = picture?.name.split(".");
    const lastIndex = imageName!.length - 1;
    const imageType = imageName![lastIndex];
    const newName = `${crypto.randomUUID()}.${imageType}`;
    return newName;
  };

  const saveImageFireStore = async (postId: string, downloadURL: string) => {
    try {
      const postRef = doc(db, "posts", postId);

      await setDoc(postRef, { imageUrl: downloadURL }, { merge: true });
      console.log("Image URL successfully saved to Firestore!");
    } catch (error) {
      console.error("Failed to save image URL to Firestore:", error);
    }
  };

  return (
    <>
      <NavBar />
      <br />
      <br />
      <br />
      <br />
      <br />

      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
        }}
      >
        Adit a Post
      </h2>
      <br />

      <form className={style.form_container} onSubmit={handleSubmit}>
        <label className={style.form_label} htmlFor="title">
          Title:
          <input
            className={style.file_input}
            onChange={handTitleChange}
            value={title}
            id="title"
            type="text"
            placeholder="Post Title"
            required
          />
        </label>
        <br />
        <label className={style.form_label} htmlFor="sulg">
          Slug:
          <input
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            className={style.file_input}
            value={slug}
            id="sulg"
            type="text"
            placeholder="URL-friendly slug"
            required
          />
        </label>
        <br />
        <label className={style.form_label} htmlFor="tages">
          Tags:
          <input
            onChange={(e) => setTags(e.target.value)}
            className={style.file_input}
            value={tags}
            id="tages"
            type="text"
            placeholder="Enter tags, separated by commas"
          />
        </label>
        <br />

        <input
          className={style.file_input}
          onChange={(e) => {
            const files = e.target.files;
            if (files?.length) {
              console.log(files[0]);
              setPicture(files[0]);
            }
          }}
          type="file"
        />

        <br />

        <ReactMde
          value={content}
          onChange={setContent}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown: string) =>
            Promise.resolve(converter.makeHtml(markdown))
          }
        />
        <br />
        <button
          className={style.submit_button}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Post"}
        </button>
        <br />
      </form>

      <br />
      <br />

      <Footer />
    </>
  );
}
