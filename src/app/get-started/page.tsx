import Link from "next/link";
import style from "../get-started/main.module.css";

export default function GetStarted() {
  return (
    <>
      <div className={style.container}>
        <div className={style.secound_container}>
          <Link href="/home">
            <button className={style.button}>Get Started</button>
          </Link>
          <p className={style.text}>
            Welcome to our blogging app! Here you can start exploring articles,
            sharing your thoughts, and connecting with like-minded people. To
            get the most out of our platform, create an account or sign in.
          </p>
        </div>
      </div>
    </>
  );
}
