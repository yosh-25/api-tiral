"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { Box, Typography } from "@mui/material";
import SearchIconAndFunction from "../components/SearchIconAndFunction";

const Search = () => {
  const router = useRouter();
  const { currentUser }: { currentUser: User | null } = useAuth();

  // ログインしていなければサインインページへ
  if (!currentUser) router.replace("/signin");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: {
            xs: "120px",
            md: "240px",
          },
        }}
      >
        <Box sx={{ width: "100%", textAlign: "center", mb: "3rem" }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: {
                xs: "2rem",
                md: "2.5rem",
                lg: "3rem",
              },
            }}
          >
            Memotube
          </Typography>
        </Box>
        <Box
          sx={{
            width: {
              xs: "70%",
              lg: "60%",
            },
          }}
        >
          <SearchIconAndFunction />
        </Box>
      </Box>
    </>
  );
};

export default Search;
