"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Word } from "../../types";
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

type WordProps = {
  word: Word;
};

const WordItemForList: React.FC<WordProps> = ({ word }) => {
  const dateString = word.registeredDate.toString();

  const [selectedId, setSelectedId] = useState<string>("");

  const clickToMoveToEdit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    router.push(`/list/${word.id}/edit`);
  };

  const router = useRouter();

  return (
    <>
      <TableRow key={word.id}>
        <TableCell>{word.spelling}</TableCell>
        <TableCell>{word.meaning}</TableCell>
        <TableCell>{word.translation}</TableCell>
        <TableCell>{dateString}</TableCell>
        <TableCell>{word.status ? "〇" : "×"}</TableCell>
        <TableCell>
          <Button onClick={(e) => clickToMoveToEdit(e)}>編集</Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default WordItemForList;
