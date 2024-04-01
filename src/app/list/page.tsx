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
import { Word, StatusOption, SortOption } from "../../types";
import WordComponent from "@/app/components/wordList";

// TODO: filterとsortを併せたuseState作成、他の部分をこれに合わせる。

function showWordList() {
  const [wordList, setWordList] = useState<Word[]>([]);
  const [filteredAndSortedWordList, setFilteredAndSortedWordList] = useState<
    Word[]
  >([]);
  const [filteredStatus, setFilteredStatus] = useState<StatusOption>({
    value: "全て",
    label: "全て",
  });
  const statusOptions: StatusOption[] = [
    { value: "全て", label: "全て" },
    { value: "〇", label: "〇" },
    { value: "×", label: "×" },
  ];
  const [selectedSortOptionByDate, setSelectedSortOptionByDate] =
    useState<SortOption>("未選択");
  const sortOptionsByDate: SortOption[] = ["未選択", "降順", "昇順"];

  const [selectedSortOptionBySpelling, setSelectedSortOptionBySpelling] =
    useState<SortOption>("全て");
  const sortOptionsBySpelling: SortOption[] = ["全て", "a→z", "z→a"];

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

  const handleStatusOption = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    // 選んだ選択肢をselectedStatusOptionとして保持する
    const selected = statusOptions.find(
      (option) => option.value === selectedValue
    ) || {
      value: "",
      label: "Select an option",
    };
    setFilteredStatus(selected);
  };

  const handleSortOptionByDate = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    // 選んだ選択肢をselecteSortOptionとして保持する
    const selected = sortOptionsByDate.find(
      (option) => option === selectedValue
    );
    if (selected !== undefined) {
      setSelectedSortOptionByDate(selected);
    } else {
      setSelectedSortOptionByDate("未選択");
    }
  };

  const handleSortOptionBySpelling = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    // 選んだ選択肢をselecteSortOptionとして保持する
    const selected = sortOptionsBySpelling.find(
      (option) => option === selectedValue
    );
    if (selected !== undefined) {
      setSelectedSortOptionBySpelling(selected);
    } else {
      setSelectedSortOptionBySpelling("全て");
    }
  };

  useEffect(() => {
    // 並び替えを最初に選択時はうまく動作しなかったためuseEffect内で仮List設定
    let tempList = [...wordList];

    // フィルター機能
    switch (filteredStatus.value) {
      case "〇":
        tempList = tempList.filter((word) => word.status === true);
        break;

      case "×":
        tempList.filter((word) => word.status === false);
        break;
      default:
        break;
    }

    // ソート機能（登録日）
    switch (selectedSortOptionByDate) {
      case "降順":
        tempList.sort(
          (a, b) =>
            new Date(b.registeredDate).getTime() -
            new Date(a.registeredDate).getTime()
        );
        break;

      case "昇順":
        tempList.sort(
          (a, b) =>
            new Date(a.registeredDate).getTime() -
            new Date(b.registeredDate).getTime()
        );

        break;
      default:
        break;
    }

    // ソート機能（アルファベット順）
    switch (selectedSortOptionBySpelling) {
      case "a→z":
        tempList.sort((a, b) => a.spelling.localeCompare(b.spelling));
        break;

      case "z→a":
        tempList.sort((a, b) => b.spelling.localeCompare(a.spelling));
        break;

      default:
        break;
    }

    setFilteredAndSortedWordList(tempList);
  }, [wordList, filteredStatus, selectedSortOptionByDate, selectedSortOptionBySpelling]);

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
            {filteredAndSortedWordList.map((word: Word) => (
              <WordComponent key={word.id} word={word} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <FormControl sx={{ width: "150px", mr: "10px" }}>
          <InputLabel id="statusSelect">絞り込み（定着度）</InputLabel>
          <Select value={filteredStatus.value} onChange={handleStatusOption}>
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: "150px", mr: "10px" }}>
          <InputLabel id="sortSelect">並び替え（登録順）</InputLabel>
          <Select value={selectedSortOptionByDate} onChange={handleSortOptionByDate}>
            {sortOptionsByDate.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: "150px", mr: "10px" }}>
          <InputLabel id="statusSelect">並び替え（綴り順）</InputLabel>
          <Select value={selectedSortOptionBySpelling} onChange={handleSortOptionBySpelling}>
            {sortOptionsBySpelling.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default showWordList;
