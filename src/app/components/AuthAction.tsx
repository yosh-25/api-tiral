"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import MainButton from "./elements/buttons/mainButton";
import Link from "next/link";
import { AuthContextType } from "@/types";

const AuthAction = () => {
  const { currentUser }: AuthContextType = useAuth();
  const auth = getAuth();

  // ログアウト処理
  const doLogout = () => {
    signOut(auth).catch((error) => {
      console.error(error);
    });
  };

  return (
    <>
      {currentUser ? (
        <Box suppressHydrationWarning={true}>
          <MainButton
            sx={{
              width: { xs: "100px", sm: "120px" },
              p: { xs: "7px", sm: "10px" },
            }}
            onClick={doLogout}
          >
            ログアウト{" "}
          </MainButton>
        </Box>
      ) : (
        <Link href="./signin">
          <Typography
            suppressHydrationWarning={true}
            sx={{ fontSize: { xs: "0.6rem", md: "1rem" } }}
          >
            会員登録/ログインはこちら
          </Typography>
        </Link>
      )}
    </>
  );
};

export default AuthAction;
