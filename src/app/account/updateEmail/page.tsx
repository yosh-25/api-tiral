"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, getAuth, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword } from "firebase/auth";
import { Box, Typography, TextField, Grid, Alert } from "@mui/material";
import MainButton from "../../components/elements/buttons/mainButton";
import { FirebaseError } from "firebase/app";

const UpdateEmailAddress = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const { currentUser }: { currentUser: User | null } = useAuth();

  // ログインしていなければサインインページへ
  useEffect(() => {
    if (!currentUser) {
      router.replace("/signin");
    }
  }, [currentUser, router]);

  const auth = getAuth();
  const user: User | null = auth.currentUser;

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
    } else {
      console.log("No user is logged in.");
    }
  }, [user]);

  const handleChange = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!user) return;

    try {
      const credential = EmailAuthProvider.credential(user.email || "", currentPassword);
      await reauthenticateWithCredential(user, credential);

      // メールアドレスの更新
      if (email !== user.email) {
        await updateEmail(user, email || "");
      }

      // パスワードの更新
      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      setSuccess("Account updated successfully!");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError("Failed to update account: " + error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <Box sx={{ width: "100%", textAlign: "center", mb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: {
              xs: "2em",
              md: "3em",
            },
          }}
        >
          アカウント設定
        </Typography>
      </Box>
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
            component="form"
            noValidate
            onSubmit={handleChange}
            sx={{ width: "90%" }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    fontSize: "1em",
                    mb: "5px",
                  }}
                >
                  メールアドレス
                </Box>
                <TextField
                  required
                  fullWidth
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    fontSize: "1em",
                    mb: "5px",
                  }}
                >
                  現在のパスワード
                </Box>
                <TextField
                  required
                  fullWidth
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  id="currentPassword"
                  autoComplete="current-password"
                  value={currentPassword || ""}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    fontSize: "1em",
                    mb: "5px",
                  }}
                >
                  新しいパスワード
                </Box>
                <TextField
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type="password"
                  id="newPassword"
                  autoComplete="new-password"
                  value={newPassword || ""}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Grid>
            </Grid>

            {error && (
              <Alert severity="error" sx={{ mt: "16px" }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: "16px" }}>
                {success}
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
                sx={{
                  width: { xs: "100%", sm: "50%" },
                  mt: "40px",
                  mb: "16px",
                }}
              >
                変更を保存
              </MainButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default UpdateEmailAddress;
