"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { FirebaseError } from "@firebase/util";

import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MainButton from "../components/elements/buttons/mainButton";

const signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const doSignup = async (e: any) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // サインアップ成功時の処理
      console.log("User signed up:", userCredential.user);
      setEmail("");
      setPassword("");
      router.push("/dashboard");
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
            新規登録
          </Typography>
        </Box>
        <Box component="form" noValidate onSubmit={doSignup}>
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
          <MainButton
            fullWidth
            sx={{ mt: 3, mb: 2 }}
          >
            新規登録
          </MainButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
            <Box>
                  <span>
                  既にアカウントをお持ちの方は
                  <a href='./signin/'>こちら</a>からログイン
                  </span>
                </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default signup;
