"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../libs/firebase";
import { getDocs, collection } from "firebase/firestore";
import {
  Box,
  Button,
  Stack,
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
import { Word } from "../../types";
import WordComponent from "@/app/components/wordList";

function showWordList() {
  const [wordList, setWordList] = useState<Word[]>([]);

  useEffect(() => {
    const fetchWordList = async () => {
      const querySnapshot = await getDocs(collection(db, "wordList"));
      const wordList = await querySnapshot.docs.map((doc) => {
        const { spelling, meaning, translation, registeredDate, status } =
          doc.data();
        const date = new Date(registeredDate.toDate());
        const formattedDate = date.toLocaleDateString('ja-JP');
        return {
          id: doc.id,
          spelling,
          meaning,
          translation,
          registeredDate: formattedDate,
          status,
        };
      });
      setWordList(wordList);
    };
    fetchWordList();

  }, []);

  return (
    <Box>
      <Typography variant="h3">単語リスト一覧</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>単語</TableCell>
              <TableCell>Meaning</TableCell>
              <TableCell>意味</TableCell>
              <TableCell>登録日</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          {/* TODO map関数でfirebaseからデータを持ってくる */}
          {/* TODO  WordList Componentを作成する*/}
          {/* {wordList.map((word: Word) => (
            <WordComponent key={word.id} word={word}/>
          ))} */}
          <TableBody>
          {wordList.map((word: Word) => (
            <WordComponent key={word.id} word={word}/>
          ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default showWordList;
