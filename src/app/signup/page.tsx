"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FirebaseError } from "@firebase/util";
import { Box, Typography, Avatar, TextField, Grid, Alert } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MainButton from "../components/elements/buttons/mainButton";

const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const doSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // 成功時の処理
      setEmail("");
      setPassword("");
      router.push("/mypage");
    } catch (e) {
      //失敗時の処理
      if (e instanceof FirebaseError) {
        if (e.code === "auth/email-already-in-use") {
          setError("このアカウントは既に存在します。");
        } else if (e.code === "auth/invalid-email") {
          setError("有効なメールアドレスを入力してください。");
        } else if (e.code === "auth/weak-password") {
          setError("パスワードは６文字以上にしてください");
        } else {
          setError(
            "サインアップ中にエラーが発生しました。もう一度お試しください。"
          );
        }
      }
    }
  };

  return (
    <Box sx={{ maxWidth: { xs: "90%", md: "800px" }, mx: "auto" }}>
      <Box
        sx={{
          mt: "64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            mb: "32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: "8px", bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            サインアップ
          </Typography>
        </Box>
        <Box
          component="form"
          noValidate
          onSubmit={doSignup}
          sx={{ width: "90%" }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="email"
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          
          {/* サインアップ失敗時はエラーメッセージを表示する。 */}
          {error && (
            <Alert severity="error" sx={{ mt: "16px" }}>
              {error}
            </Alert>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MainButton
              sx={{ width: { xs: "100%", sm: "50%" }, mt: "35px", mb: "16px" }}
            >
              サインアップ
            </MainButton>
          </Box>
          <Grid container justifyContent="center">
            <Grid item>
              <Box>
                <span>
                  既にアカウントをお持ちの方は
                  <a href="./signin/">こちら</a>からログイン
                </span>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
