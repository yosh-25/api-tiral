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
import * as deepl from 'deepl-node';

export default function Learn() {
  const [textFromAPI, setTextFromAPI] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [selectedWord, setSelectedWord] = useState("");
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

  // 記事内の単語をクリックして選択状態にする。
  const handleTextSelection = () => {
    const text = window.getSelection()?.toString();
    if (text) {
      setSelectedWord(text);
    }
  };

  // 選択した単語を辞書で調べる。
  const handleDictionarySearch = () => {
    if (!selectedWord) return;

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`)
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

  // 選択した箇所の日本語訳をDeepLで表示
  const authKey: any = process.env.DEEPL_API_KEY
  const translator = new deepl.Translator(authKey);

  const handleDeeplSearch = async () => {
    const targetLang: deepl.TargetLanguageCode = 'ja';
    const results = await translator.translateText(
      ['Hello, world!', 'How are you?'],
      null,
      targetLang,
    );
    results.map((result: deepl.TextResult) => {
      console.log(result.text);
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
          <Typography
            onMouseUp={handleTextSelection}
            onClick={handleDictionarySearch}
          >
            {textFromAPI}{" "}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>        
        <Typography sx={{ mt: 2 }}>Selected Word: {selectedWord}</Typography>
        <Typography>Free Dictionaryの検索結果</Typography>
        <Typography sx={{ mt: 2 }}>Definition: {wordDefinition}</Typography>
        <Typography>DeepLの検索結果</Typography>
        <Button
        onClick={handleDeeplSearch}
        >DeepL Search</Button>
      </Box>
    </Box>
  );
}