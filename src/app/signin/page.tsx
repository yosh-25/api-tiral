"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import { useAuth } from "../../../context/AuthContext";
import {} from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { auth } from "../../lib/firebase";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Grid,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MainButton from "../components/elements/buttons/mainButton";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { currentUser }: any = useAuth();

  if (currentUser) router.replace("/mypage"); // ログインしていなければサインインページへ転

  const doSignin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // サインアップ成功時の処理
      console.log("User signed in:", userCredential);
      setEmail("");
      setPassword("");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Box
          sx={{
            mb: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            ログイン
          </Typography>
        </Box>
        <Box component="form" noValidate onSubmit={doSignin}>
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
                placeholder="aaa@gmail.com"
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
          <MainButton fullWidth sx={{ mt: 3, mb: 2 }}>
            ログイン
          </MainButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Box>
                <span>
                  アカウントをお持ちでない場合は、
                  <a href="./signup/">こちら</a>からサインアップしてください
                </span>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: "1rem" }}>
            Demo Email Addres: aaa@gmail.com
            <br />
            Demo Password: aaaaaa
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
// ヘッダーを表示しないフラグを設定
Signin.noHeader = true;

export default Signin;
