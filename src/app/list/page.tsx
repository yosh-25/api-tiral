"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../libs/firebase";
import { getDocs, collection } from "firebase/firestore";
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
import { SelectChangeEvent } from "@mui/material/Select";
import { Word, FilterByStatus, StatusOption } from "../../types";
import WordComponent from "@/app/components/wordList";

function showWordList() {
  const [wordList, setWordList] = useState<Word[]>([]);
  const [filterByStatus, setFilterByStatus] = useState<FilterByStatus>();
  const [selectedOption, setSelectedOption] = useState<StatusOption>({
    value: "全て",
    label: "全て",
  });

  const statusOptions: StatusOption[] = [
    { value: "全て", label: "全て" },
    { value: "〇", label: "〇" },
    { value: "×", label: "×" },
  ];

  const handleSelectOption = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    // 選んだ選択肢をselectedOptionとして保持する
    const selected = statusOptions.find(
      (option) => option.value === selectedValue
    ) || {
      value: "",
      label: "Select an option",
    };
    setSelectedOption(selected);
  };
  // TODO: 次回ここから。selectedOptionと紐づけてフィルター機能を実装する。

  useEffect(() => {
    const fetchWordList = async () => {
      const querySnapshot = await getDocs(collection(db, "wordList"));
      const wordList = await querySnapshot.docs.map((doc) => {
        const { spelling, meaning, translation, registeredDate, status } =
          doc.data();
        const date = new Date(registeredDate.toDate());
        const formattedDate = date.toLocaleDateString("ja-JP");
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3" sx={{ textAlign: "center" }}>
        単語リスト一覧
      </Typography>

      <TableContainer sx={{ marginBottom: "30px" }}>
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
          {/* TODO map関数でfirebaseからデータを持ってくる */}
          {/* TODO  WordList Componentを作成する*/}
          {/* {wordList.map((word: Word) => (
            <WordComponent key={word.id} word={word}/>
          ))} */}
          <TableBody>
            {wordList.map((word: Word) => (
              <WordComponent key={word.id} word={word} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FormControl
        sx={{ width: "150px", marginLeft: "auto", marginRight: "auto" }}
      >
        <InputLabel id="statusSelect">定着度</InputLabel>
        <Select value={selectedOption.value} onChange={handleSelectOption}>
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default showWordList;
