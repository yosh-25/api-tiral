"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/../libs/firebase";
import WordItemForEdit from "@/app/components/wordListForEdit";
import { Word } from "@/types";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  Select,
  TextField,
  Typography,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function wordEdit({ params }: { params: { id: string } }) {
  const [wordDetails, setWordDetails] = useState<Word>({
    id: "",
    spelling: "",
    meaning: "",
    translation: "",
    registeredDate: "",
    status: false,
  });

  const id = params.id;
  useEffect(() => {
    const fetchWordDetails = async () => {
      if (typeof id === "string") {
        const docRef = doc(db, "wordList", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const { spelling, meaning, translation, registeredDate, status } =
            docSnap.data();
          // const date = new Date(registeredDate.toDate());
          // const formattedDate = date.toLocaleDateString("ja-JP");

          setWordDetails({
            id,
            spelling,
            meaning,
            translation,
            registeredDate,
            status,
          });
        }
      }
    };
    fetchWordDetails();
  }, [id]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3" sx={{ textAlign: "center" }}>
        単語編集ページ
      </Typography>
      <WordItemForEdit key={wordDetails.id} word={wordDetails} />
    </Box>
  );
}
