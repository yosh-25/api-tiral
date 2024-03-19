"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Input,
} from "@mui/material";

export default function Learn() {
  const [textFromAPI, setTextFromAPI] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [dictionaryWord, setDictionaryWord] = useState("");
  const [wordDefinition, setWordDefinition] = useState("");

  const handleWikipediaSearch = () => {
    fetch(
      `/api/proxy/w/api.php?action=query&format=json&prop=extracts&titles=${searchWord}&formatversion=2&exchars=1000&explaintext`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Data:", data); // 受信したデータをログに出力
        // APIのレスポンスから必要な箇所にアクセス。テキストを抽出。
        const page = data.query.pages[0];
        if (page && page.extract) {
          setTextFromAPI(page.extract);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error); // エラーがあれば出力
      });
  };

  const handleDictionarySearch = () => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${dictionaryWord}`)
      .then((response) => response.json())
      .then((data) => {
        const definition =
          data[0] &&
          data[0].meanings[0] &&
          data[0].meanings[0].definitions[0] &&
          data[0].meanings[0].definitions[0].definition;
        if (definition) {
          setWordDefinition(definition);
        } else {
          setWordDefinition("Definition not found");
        }
      })
      .catch((error) => {
        console.error("Dictionary API error", error);
        setWordDefinition("Error fetching definition.");
      });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Box
        width="50%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
        mt={10}
      >
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
        >
          {/* Wikipedia検索用のフィールド */}
          <Box mb={2}>
            <Typography>検索</Typography>
            <Input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="検索ワードを入力"
            />
          </Box>
        </Box>
        <Button onClick={handleWikipediaSearch}>Press</Button>
        <Box
          width="50%"
          border={2}
          borderColor="grey.500"
          borderRadius={1}
          pl={1.5}
        >
          {/* 検索したワードのテキストを表示 */}
          <Typography>{textFromAPI} </Typography>
        </Box>
      </Box>
      <Box>
        <Typography>辞書検索</Typography>
        <Input 
          type="text"
          value={dictionaryWord}
          onChange={(e) => setDictionaryWord(e.target.value)}
          placeholder='辞書で検索するワード'
        />
        <Button
         onClick={handleDictionarySearch}
        >辞書検索</Button>
        <Typography>{wordDefinition}</Typography>
      </Box>
    </Box>
  );
}
