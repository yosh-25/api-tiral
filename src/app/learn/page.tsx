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
  const router = useRouter();
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
  const [success, setSuccess] = useState("");

  // TODO: 分かりやすい内容に変更を検討する。日本語から英語脳を作るアプリ？「英語脳アプリ」
  // TODO fetchしてくるwikipediaの参照先は要検討。できればMain PageのTop記事にアクセスしたい。または他のAPI？←やはり動画？著作権切れの小説も候補にはあるが・・
  // Todo; youtube apiの実装を試みる

  const handleWikipediaSearch = () => {
    fetch(
      `/api/proxy/w/api.php?action=query&format=json&prop=extracts&titles=${searchWord}&formatversion=2&exchars=2000&explaintext`
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
  const handleDictionarySearch = async (
    text: string,
    target_lang: DeeplLanguages
  ) => {
    if (!wordInfo.spelling) return;

    const [dictionaryResponse, translationResult] = await Promise.all([
      // 辞書APIへのリクエスト
      fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${wordInfo.spelling}`
      ).then((response) => response.json()),

      // DeepLへのリクエスト
      Translator(text, target_lang),
    ]);

    // 辞書からのレスポンスへの処理
    const definition =
      dictionaryResponse[0]?.meanings[0]?.definitions[0]?.definition;

    // DeepLからのレスポンスを処理
    const translation = translationResult.text;

    // 2つのAPIからの処理をまとめて反映
    if (definition || translation) {
      const newWordInfo = {
        ...wordInfo,
        meaning: definition,
        translation: translation,
      };
      setWordInfo(newWordInfo);
    }
  };

  // 選択したワードをfirestoreに保存
  const registerWord = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const formattedDate = `${year}年 ${month}月 ${date}日`;
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
      registeredDate: formattedDate,
      status: wordInfo.status,
    });

    setSuccess("登録できました！");
  };

  return (
    <Box display="flex" justifyContent="spacebetween" alignItems="center">
      {/* 記事検索、検索記事の表示 */}
      <Grid
        container
        spacing={5}
        direction="column"
        justifyContent="center"
        alignItems="center"
        mr={8}
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
          <Box mb={2}>
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
          height={550}
          width={500}
          p={2}
        >
          {/* 検索したワードのテキストを表示 */}
          <Typography
            onMouseUp={handleTextSelection}
            onClick={() => handleDictionarySearch(wordInfo.spelling, "JA")}
            textAlign="left"
          >
            {textFromAPI
              ? "分からない単語はダブルクリックをして、右の辞書機能で調べましょう💡"
              : "(検索した記事が表示されます)"}
            <br />
            <br />
            {textFromAPI}
          </Typography>
        </Box>
      </Grid>

      {/* 選択したワードの辞書検索を表示 */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="left"
        mt={50}
        height={500}
        width={500}
      >
        <Typography mb={2} height={50} width={300} textAlign="left">
          調べた単語: <br /> {wordInfo.spelling}
        </Typography>
        {/* 英英辞書&DeepLの結果 */}
        <Typography mb={2} height={250} width={300}>
          意味: <br /> {wordInfo.meaning} <br />
          {wordInfo.translation}
        </Typography>
        <Box width={300}>
          <Button onClick={registerWord}>単語リストに登録</Button>
        </Box>
        <Typography>
          {error}
          {success}
        </Typography>

        <Box mb={1}>
          <Button variant="contained" onClick={() => router.push(`/list`)}>
            単語リストへのリンク（とりあえず設置）
          </Button>
        </Box>
        <Button variant="contained" onClick={() => router.push(`/`)}>
          Topページへのリンク（とりあえず設置）
        </Button>
      </Box>
    </Box>
  );
}
