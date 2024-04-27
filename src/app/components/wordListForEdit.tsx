"use client";
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/../libs/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Word, StatusOption } from "@/types";
import {
  Box,
  Button,
  Input,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

type WordProps = {
  word: Word;
};

const WordItemForEdit: React.FC<WordProps> = ({ word }) => {
  const dateString = word.registeredDate.toString();
  const [wordDetails, setWordDetails] = useState<Word>({
    id: word.id,
    spelling: word.spelling,
    meaning: word.meaning,
    translation: word.translation,
    registeredDate: word.registeredDate,
    status: word.status,
  });

  const statusOptions: StatusOption[] = [
    { value: "〇", label: "〇" },
    { value: "×", label: "×" },
  ];

  const [succeed, setSucceed] = useState<string>("");

  const id = word.id;

  const clickToMoveToEdit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    router.push(`/list/${word.id}/edit`);
  };

  const updateSpelling = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (wordDetails) {
      setWordDetails({
        ...wordDetails,
        spelling: e.target.value,
      });
    }
  };

  const updateMeaning = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (wordDetails) {
      setWordDetails({
        ...wordDetails,
        meaning: e.target.value,
      });
    }
  };

  const updateTranslation = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (wordDetails) {
      setWordDetails({
        ...wordDetails,
        translation: e.target.value,
      });
    }
  };

  const updateRegisteredDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (wordDetails) {
      setWordDetails({
        ...wordDetails,
        registeredDate: e.target.value,
      });
    }
  };

  const updateStatus = (newValue: string) => {
    // ブラウザ上で〇×を入れてもらい、それをstringからbooleanに変換。
    setWordDetails({
      ...wordDetails,
      status: newValue === "〇", //〇ならtrueを返し、×ならfalseを返す。
    });
  };

  const sendDataToFirestore = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const docRef = doc(db, "wordList", id);
    await updateDoc(docRef, {
      id,
      spelling: wordDetails.spelling,
      meaning: wordDetails.meaning,
      translation: wordDetails.translation,
      registeredDate: wordDetails.registeredDate,
      status: wordDetails.status,
    });
    setSucceed("保存できました！");
  };

  const router = useRouter();

  return (
    <>
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
            <TableRow key={word.id}>
              <TableCell>
                <TextField
                  type="text"
                  value={wordDetails.spelling}
                  onChange={updateSpelling}
                />
              </TableCell>
              <TableCell>
                {" "}
                <TextField
                  type="text"
                  value={wordDetails.meaning}
                  onChange={updateMeaning}
                />
              </TableCell>
              <TableCell>
                {" "}
                <TextField
                  type="text"
                  value={wordDetails.translation}
                  onChange={updateTranslation}
                />
              </TableCell>
              <TableCell>
                {" "}
                <TextField
                  type="text"
                  value={wordDetails.registeredDate}
                  onChange={updateRegisteredDate}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={wordDetails.status ? "〇" : "×"}
                  onChange={(e) => updateStatus(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mb={2}>
          <Button
            type="button"
            variant="contained"
            onClick={sendDataToFirestore}
          >
            保存する
          </Button>
          {succeed && <Typography>{succeed}</Typography>}
        </Box>
        <Box mb={1}>
          <Button
            type="button"
            variant="contained"
            onClick={() => router.push(`/list`)}
          >
            単語リストへのリンク（とりあえず設置）
          </Button>
        </Box>
        <Box>
          <Button
            type="button"
            variant="contained"
            onClick={() => router.push(`/`)}
          >
            Topページへのリンク（とりあえず設置）
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default WordItemForEdit;
