"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../lib/firebase";
import { getDocs, collection } from "firebase/firestore";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  IconButton,
} from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  MemosByVideoId,
  LatestTimestampByVideoId,
  FetchedMemo,
} from "../../types";
import CustomCard from "../components/elements/cards/CustomCardsForSettings";
import MainButton from "../components/elements/buttons/mainButton";
import SearchBar from "../components/elements/searchBar";
import SearchIconAndFunction from "../components/SearchIconAndFunction";

const page = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%", textAlign: "center", mt: 20, mb: 5 }}>
          <Typography variant="h3">Memotube</Typography>
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

export default page;
