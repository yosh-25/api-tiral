"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { User } from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { auth } from "@/lib/firebase";
import { Box, Typography, Avatar, TextField, Grid, Alert } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MainButton from "../components/elements/buttons/mainButton";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { currentUser }: { currentUser: User | null } = useAuth();

  useEffect(() => {
    if (currentUser) {
      router.replace("/mypage");
    }
  }, [currentUser]);

  const doSignin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (currentUser) {
      router.replace("/mypage");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // サインイン成功時の処理
      setEmail("");
      setPassword("");
    } catch (e) {
      //失敗時の処理
      if (e instanceof FirebaseError) {
        if (e.code === "auth/invalid-email") {
          setError("有効なメールアドレスを入力してください。");
        } else if (e.code === "auth/user-not-found") {
          setError("該当するユーザーが見つかりませんでした。");
        } else if (e.code === "auth/too-many-requests") {
          setError("エラーが発生しました。後ほどもう一度実行してください。");
        } else {
          setError(
            "サインイン中にエラーが発生しました。もう一度お試しください。"
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
            サインイン
          </Typography>
        </Box>
        <Box
          component="form"
          noValidate
          onSubmit={doSignin}
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
          
          {/* サインイン失敗時はエラーメッセージを表示する。 */}
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
              サインイン
            </MainButton>
          </Box>
          <Grid container justifyContent="center" spacing={3}>
            <Grid item>
              <Box>
                <span>
                  アカウントをお持ちでない場合は、
                  <a href="./signup/">こちら</a>からサインアップしてください
                </span>
              </Box>
            </Grid>
            <Grid item sx={{ mt: "1rem" }}>
              Demo Email Addres: aaa@gmail.com
              <br />
              Demo Password: aaaaaa
            </Grid>
            {/* デモアカウントのパスワード等検討 */}
            {/* <Grid item sx={{ mt: "1rem" }}>
              Demo Email Addres: 2xa5ri7llkc_@gmail.com
              <br />
              Demo Password: z1zHAVL1
            </Grid> */}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
// ヘッダーを表示しないフラグを設定
Signin.noHeader = true;

export default Signin;
