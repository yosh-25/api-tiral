"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { Box, Typography, TextField, Grid, Alert } from "@mui/material";
import MainButton from "../components/elements/buttons/mainButton";
import { FirebaseError } from "firebase/app";

const AccountSetting = () => {
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
      const credential = EmailAuthProvider.credential(
        user.email || "",
        currentPassword
      );
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
          アカウント情報
        </Typography>
      </Box>
      <Box sx={{ maxWidth: { xs: "90%", md: "800px" }, mx: "auto" }}>
        <Box
          sx={{
            mt: "64px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              sx={{   
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems:"center",             
              }}
            >
              <Box
                sx={{
                  fontSize: "1em",
                  mb: "5px",            
                }}
              >
                メールアドレス:
              </Box>
              <Box
                borderBottom={1}
                sx={{
                    width: { xs: "75%", sm: "60%" },
                }}
                
              >
                {email}
              </Box>
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
              <Typography
                borderBottom={1}
                sx={{
                  width: { xs: "75%", sm: "60%" },
                }}
              >
                ••••••
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default AccountSetting;
