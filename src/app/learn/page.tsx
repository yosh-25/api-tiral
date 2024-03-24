"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../libs/firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Input,
} from "@mui/material";
import { Translator } from "../../../libs/Translation";
import { DeeplLanguages } from "deepl";

export default function Learn() {
  // 以下2つもオブジェクト型にして1つのuseStateにまとめる予定
  const [textFromAPI, setTextFromAPI] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [wordInfo, setWordInfo] = useState({
    id: "",
    spelling: "",
    meaning: "",
    translation: "",
    registeredDate: "",
    status: false,
  });
  const [ error, setError] =useState("");

  //  TODO 次のページに進める前にコンポーネント化しておく。
  //  TODO anyを消しておく。

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
      const newWordInfo = {
        ...wordInfo,
        spelling: text,
      };
      setWordInfo(newWordInfo);
    }
    console.log(wordInfo.spelling);
    // if (text) {
    //   setSelectedWord(text);
    // }
  };

  // 選択した単語を辞書で調べる。
  const handleDictionarySearch = () => {
    if (!wordInfo.spelling) return;

    fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${wordInfo.spelling}`
    )
      .then((response) => response.json())
      .then((data) => {
        const definition =
          data[0] &&
          data[0].meanings[0] &&
          data[0].meanings[0].definitions[0] &&
          data[0].meanings[0].definitions[0].definition;
        if (definition) {
          const newWordInfo = {
            ...wordInfo,
            meaning: definition,
          };
          setWordInfo(newWordInfo);
          console.log(wordInfo.meaning);
        }
      })
      .catch((error) => {
        console.error("Dictionary API error", error);
      });
  };

  // 選択した箇所の日本語訳をDeepLで表示
  const handleDeeplTranslation = (
    text: string,
    target_lang: DeeplLanguages
  ) => {
    const translations = Translator(text, target_lang);
    translations.then((result) => {
      const newWordInfo = {
        ...wordInfo,
        translation: result.text,
      };
      setWordInfo(newWordInfo);
      console.log(wordInfo.translation);
    });
  };

  // 選択したワードをfirestoreに保存
  const registerWord = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const today = new Date();
    if((!wordInfo?.spelling)){
      setError('単語が未選択です。')
    }
    if((!wordInfo?.translation)){
      setError('訳が未設定です。')
    }

    await addDoc(collection(db, 'wordList'), {
    spelling: wordInfo.spelling,
    meaning: wordInfo.meaning,
    translation: wordInfo.translation,
    registeredDate: today,
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
        <Typography sx={{ mt: 2 }}>
          Selected Word: {wordInfo.spelling}
        </Typography>

        <Typography>Free Dictionaryの検索結果</Typography>
        <Typography sx={{ mt: 2 }}>Definition: {wordInfo.meaning}</Typography>

        <Typography>DeepLの検索結果</Typography>
        <Button
          onClick={() => {
            handleDeeplTranslation(`${wordInfo.spelling}`, "JA");
          }}
        >
          DeepL Search
        </Button>
        <Typography>→翻訳結果{wordInfo.translation}</Typography>
        <Button onClick={registerWord}>お気に入りに登録</Button>
      </Box>
      <Box></Box>
    </Box>
  );
}
