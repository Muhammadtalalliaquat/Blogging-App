"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebaseauth";
import React from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type btnLabelType = {
  btnLabel: string;
  showText: string;
  showMsg: string;
  loginSignupText: string;
  fogotPassword: string;
  errorMsg: string;
  btnFunc: (email: string, password: string, router: AppRouterInstance) => void;
};

export default function AuthForm({
  btnLabel,
  showMsg,
  loginSignupText,
  showText,
  fogotPassword,
  errorMsg,
  btnFunc,
}: btnLabelType) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const validateForm = () => {
    const newErrors = [];

    if (!email.includes("@")) {
      newErrors.push("Please enter a valid email.");
    }
    if (password.length < 6) {
      newErrors.push("Password must be at least 6 characters.");
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (newErrors.length === 0) {
      console.log("Form submitted successfully!");
      setErrors([]);
    } else {
      setErrors(newErrors);
      console.log(errors);
    }
  };

  const linkPush = () => {
    router.push(showMsg);
  };

  const handleResetPassword = () => {
    if (!email) {
      setError("Please enter your email");

      setTimeout(() => {
        setError("");
      }, 2000);
      setMessage("");
      return;
    }

    try {
      sendPasswordResetEmail(auth, email);
      setMessage("Password reset! Check your inbox.");
      setError("");
    } catch (error) {
      setMessage("");
      setError("Failed to send password reset email. Please try again.");
      console.error("Error sending password reset email:", error);
    }
    setTimeout(() => {
      setError("");
    }, 2000);
  };

  return (
    <>
      <html data-theme={"light"}>
        <body>
          <br />
          <br />
          <br />

          <div
            style={{ width: "30%", margin: "0 auto" }}
            className="flex items-center flex-col gap-2 drop-shadow-md"
          >
            <h1
              style={{ color: "grey", textAlign: "center", fontSize: "40px" }}
            >
              {btnLabel}
            </h1>

            <div style={{ boxShadow: "1px 1px 10px #818181", padding: "60px" }}>
              <form onSubmit={handleSubmit}>
                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  <input
                    value={email}
                    id="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    type="text"
                    className="grow"
                    placeholder="Email"
                    required
                  />
                </label>
                <br />
                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    type="password"
                    className="grow"
                    required
                  />
                </label>
                <div className="flex items-center flex-col gap-2">
                  {errors.length > 0 && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "10px",
                      }}
                    >
                      {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
                  <span
                    style={{
                      color: "grey",
                      margin: "5px",
                      fontSize: "11px",
                    }}
                  >
                    {message}
                  </span>
                  {error ? (
                    <span
                      style={{
                        color: "red",
                        fontSize: "12px",
                        textAlign: "center",
                      }}
                    >
                      {error}
                    </span>
                  ) : (
                    <a
                      style={{ color: "red", fontSize: "12px" }}
                      className="resetPasswordtext"
                      onClick={handleResetPassword}
                      href="#"
                    >
                      {" "}
                      {fogotPassword}
                    </a>
                  )}
                  <p className="show-text" style={{ fontSize: "12px" }}>
                    {showText}{" "}
                    <a href="#" onClick={linkPush}>
                      {loginSignupText}
                    </a>
                  </p>
                </div>
                <br />
                {/* {errorMsg && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    {errorMsg}
                  </div>
                )} */}
                <button
                  type="submit"
                  onClick={() => {
                    btnFunc(email, password, router);
                  }}
                  style={{ width: "100%" }}
                  className="btn btn-neutral"
                >
                  {btnLabel}
                </button>
              </form>
              <br />
              {errorMsg && (
                <div
                  style={{
                    color: "red",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
        </body>
      </html>
    </>
  );
}
