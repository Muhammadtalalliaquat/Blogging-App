"use client";

import { useCallback, useState } from "react";
import NavBar from "./navBar";
import { CreatePost } from "@/firebase/firebasestore";
import { useRouter } from "next/navigation";
import ReactMde from "react-mde";
import Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/firebase/firebaseconfig";
import { doc, setDoc } from "firebase/firestore";
import style from "../components/main.module.css";
import Footer from "./footer";

export default function AdminPostForm() {
  const converter = new Showdown.Converter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [slug, setSlug] = useState<string>("");
  const [tags, setTags] = useState("");
  const [picture, setPicture] = useState<File>();
  const [error, setError] = useState("");
  const router = useRouter();

  const handSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !content || !tags) {
      setError("Please fill out all required fields.");
      return;
    }

    const postId = await CreatePost(title, content, tags, slug);

    if (postId) {
      uploadImage(postId);
      router.push("/all-post");
    } else {
      console.error("Failed to create post");
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
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
          marginTop: "85px",
        }}
      >
        Create a Post
      </h2>
      <br />

      <form className={style.form_container} onSubmit={handSubmit}>
        <label className={style.form_label} htmlFor="title">
          Title:
          <input
            className={style.form_input}
            onChange={handTitleChange}
            value={title}
            id="title"
            type="text"
            placeholder="Post Title"
          />
        </label>
        <br />
        <label className={style.form_label} htmlFor="sulg">
          Sulg:
          <input
            className={style.form_input}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            value={slug}
            id="sulg"
            type="text"
            placeholder="URL-friendly slug"
          />
        </label>
        <br />
        <label className={style.form_label} htmlFor="tages">
          Tags:
          <input
            className={style.form_input}
            onChange={(e) => setTags(e.target.value)}
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
        <button type="submit" className={style.submit_button}>
          Create Post
        </button>
        <br />
        {error && <p className={style.error_message}>{error}</p>}
      </form>
      <br />
      <br />

      <Footer />
    </>
  );
}
