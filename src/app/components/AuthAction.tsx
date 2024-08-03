"use client";
import React, { useState } from "react";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import MainButton from "./elements/buttons/mainButton";
import Link from "next/link";
import { AuthContextType } from "@/types";

const AuthAction = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { currentUser }: AuthContextType = useAuth();
  const auth = getAuth();

  // ログアウト処理
  const doLogout = () => {    
    try {
      signOut(auth)
    }catch(e) {
      // エラーがある場合は、UI上にエラーメッセージを表示する。
      setOpen(true);
    };
  };

  // エラーメッセージを閉じる（メッセージ枠外のクリックは無効）
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
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
      
      {/* ログアウト失敗時はエラーメッセージを表示する。 */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          ログアウトに失敗しました。もう一度お試しください。
        </Alert>
      </Snackbar>
    </>
  );
};

export default AuthAction;
