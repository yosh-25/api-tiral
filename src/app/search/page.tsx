"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { Box, Typography } from "@mui/material";
import SearchIconAndFunction from "../components/SearchIconAndFunction";

const Search = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

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
            xs: 15,
            md: 30,
          },
        }}
      >
        <Box sx={{ width: "100%", textAlign: "center", mb: "3em" }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: {
                xs: "2em",
                md: "2.5em",
                lg: "3em",
              },
            }}
          >
            Memotube
          </Typography>
        </Box>
        <Box
          sx={{
            width: "70%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SearchIconAndFunction />
        </Box>
      </Box>
    </>
  );
};

export default Search;
