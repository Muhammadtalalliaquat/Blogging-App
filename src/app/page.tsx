"use client";

import { useEffect, useState } from "react";
import style from "./all-post/main.module.css";

export default function RootPage() {
  const [Loading, setLoading] = useState(false);

  const fetcLoadingData = () => {
    setTimeout(() => {
      setLoading(true);
    }, 2000);
  };

  useEffect(() => {
    fetcLoadingData();
    const interval = setInterval(() => {
      window.location.reload();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {Loading ? (
        <></>
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
    </>
  );
}
