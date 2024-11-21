"use client";

import AuthForm from "@/components/authemticationForm";
import { loginForm } from "@/firebase/firebaseauth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";


export default function Home() {

  const [error, setError] = useState("");
  const router = useRouter();

  return (
    <>
        <AuthForm 
        btnLabel={"Login"}
        // btnFunc={loginForm}
        errorMsg={error}
        btnFunc={(email, password) =>
          loginForm(email, password, router, setError)
        }
        showText={"Doest not have an account?"}
        loginSignupText={"Signup"}
        showMsg={"/signup"}
        fogotPassword={"forgot Password"}
        /> 
    </>
  );
}