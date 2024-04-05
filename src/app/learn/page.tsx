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
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Translator } from "../../../libs/Translation";
import { DeeplLanguages } from "deepl";

export default function Learn() {
  // 以下2つもオブジェクト型にして1つのuseStateにまとめる予定
  const [textFromAPI, setTextFromAPI] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [wordInfo, setWordInfo] = useState({
    id: "",
    spelling: "",
    meaning: "",
    translation: "",
    registeredDate: "",
    status: false,
  });
  const [error, setError] = useState("");

  // TODO fetchしてくるwikipediaの参照先は要検討。できればMain PageのTop記事にアクセスしたい。または他のAPI？
// TODO learnページ、リストページ、編集ページのCSSを一旦見れるくらいに整える。

  const handleWikipediaSearch = () => {
    fetch(
      `/api/proxy/w/api.php?action=query&format=json&prop=extracts&titles=${searchWord}&formatversion=2&exchars=1500&explaintext`
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
    if (!wordInfo?.spelling) {
      setError("単語が未選択です。");
      return;
    }
    if (!wordInfo?.translation) {
      setError("訳が未設定です。");
      return;
    }

    await addDoc(collection(db, "wordList"), {
      spelling: wordInfo.spelling,
      meaning: wordInfo.meaning,
      translation: wordInfo.translation,
      registeredDate: today,
      status: wordInfo.status,
    });
  };

  return (
    <Box display="flex" justifyContent="spacebetween" alignItems="center" 
    sx={{ width:700}}
    >
      {/* 記事検索、検索記事の表示 */}
      <Grid container
        spacing={5}
        mr={20}
        // display="flex"
        // flexDirection="column"
        direction='column'
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
        <SearchIcon fontSize="large" />
        <Typography variant="h3" fontSize="1.5rem" fontWeight="500">
          読みたい記事を検索してみよう
          <br />
          （例:Shohei Ohtani）
        </Typography>
        </Grid>
        <Grid item>
            {/* Wikipedia検索用のフィールド */}
              <Box
              mb={2}
              >
              <Input
                type="text"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                placeholder="検索ワードを入力"
              />
              </Box>
          </Grid>
          <Button onClick={handleWikipediaSearch}>検索</Button>
          <Box
            border={2}
            borderColor="grey.500"
            borderRadius={1}
            pl={1.5}
            minHeight={500}
            minWidth={400}
          >
            {/* 検索したワードのテキストを表示 */}
            <Typography
              onMouseUp={handleTextSelection}
              onClick={handleDictionarySearch}
            >
              {/* 一旦ランダムテキストを表示させています */}
              {/* Mr. Montoya knows the way to the bakery even though he's never been there.
He had concluded that pigs must be able to fly in Hog Heaven.
I cheated while playing the darts tournament by using a longbow.
The three-year-old girl ran down the beach as the kite flew behind her.
The blue parrot drove by the hitchhiking mongoose.
The underground bunker was filled with chips and candy.
He dreamed of eating green apples with worms.
I'll have you know I've written over fifty novels
Garlic ice-cream was her favorite.
Now I need to ponder my existence and ask myself if I'm truly real */}
              {textFromAPI}
            </Typography>
          </Box>
      </Grid>

      {/* 選択したワードの辞書検索を表示 */}
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
        <Button onClick={registerWord}>単語リストに登録</Button>
        <Typography>{error}</Typography>
      </Box>
      <Box></Box>
    </Box>
  );
}
