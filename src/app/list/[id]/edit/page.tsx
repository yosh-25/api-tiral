"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/../libs/firebase";
import WordItem from "@/app/components/wordList";
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

  // TODO: asを使用しない方法を検討する。
  //   TODO: このページ用テーブルコンポーネント作成、onChangeで編集、保存ボタン作成 4/2
  useEffect(() => {
    const fetchWordDetails = async () => {
      if (typeof id === "string") {
        const docRef = doc(db, "wordList", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const { spelling, meaning, translation, registeredDate, status } =
            docSnap.data();
          const date = new Date(registeredDate.toDate());
          const formattedDate = date.toLocaleDateString("ja-JP");

          setWordDetails({
            id,
            spelling,
            meaning,
            translation,
            registeredDate: formattedDate,
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

      <TableContainer sx={{ marginBottom: "50px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>単語</TableCell>
              <TableCell>Meaning</TableCell>
              <TableCell>意味</TableCell>
              <TableCell>登録日</TableCell>
              <TableCell>定着度</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <WordItem
              key={wordDetails.id}
              word={wordDetails}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
