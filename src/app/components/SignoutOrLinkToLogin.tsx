"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from '@mui/material';
import { signInWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import { useAuth } from "../../../context/AuthContext";
import {} from "firebase/auth";
import ButtonToAddMemo from './elements/buttons/buttonToAddMemo';
import MainButton from './elements/buttons/mainButton';
import Link from "next/link";

  const Signout = () => {
  const router = useRouter();
  const { currentUser }:any = useAuth();
    const auth = getAuth();
    const doLogout=() => {
    signOut(auth)
      .then(() => {
        console.log("ログアウト完了！");
        router.push("/signin");
      })
      .catch((error) => {
        console.log(error);
      });  
    };
  return (    
           <>
             { currentUser ? (
              <Box suppressHydrationWarning={true}>
                <MainButton onClick={doLogout}>ログアウト </MainButton>
              </Box>
            ):(
              <Link href='./signin'>
              <Typography suppressHydrationWarning={true}>会員登録/ログインはこちら</Typography>
              </Link>
            )}
         </>
  );
};

export default Signout;
