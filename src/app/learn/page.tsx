"use client";
import React, { useEffect, useState} from "react";
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

  const [ textFromAPI, setTextFromAPI] = useState('');
  const [ searchWord, setSearchWord] = useState('');

  useEffect(() => {
    fetch(`/api/proxy/w/api.php?action=query&format=json&prop=extracts&titles=${searchWord}&formatversion=2&exchars=1000&explaintext`)
      .then(response => {
        console.log('Response status:', response.status); // レスポンスのステータスを確認
        return response.json();
      })
      .then(data => {
        console.log('Data:', data); // 受信したデータをログに出力
        // APIのレスポンスから必要な箇所にアクセス。テキストを抽出。
        const page = data.query.pages[0];
        if (page && page.extract) {
          setTextFromAPI(page.extract);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error); // エラーがあれば出力
      });
      

  }, []);

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
          <Box mb={2}>
            <Typography>検索</Typography>
            <Input type="text" value={searchWord} onChange={(e)=> setSearchWord(e.target.value)} placeholder="検索ワードを入力" />
          </Box>
        </Box>
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
        <Button>Press</Button>
      </Box>
    </Box>
  );
}
