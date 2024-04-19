"use client";
import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";


const YOUTUBE_SEARCH_API_URI = "https://www.googleapis.com/youtube/v3/search?";
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

// todo 次回Third-party cookie will be blocked. Learn more in the Issues tab.の解決から

const SearchResults = () => {

    const [videoId, setVideoId] = useState("");

    const searchVideos = (e:any) => {
        e.preventDefault()
        useEffect(() => {
            //クエリ文字列を整理する
        const params = {
            key: API_KEY,
            q: 'ヒカキン', //検索ワード
            type: 'video',
            maxResults: '1', //表示する動画数
            order: 'viewCount', //結果の並び順を再生数が多い順に
         };
         const queryParams = new URLSearchParams(params);

         //APIをリコール
         fetch(YOUTUBE_SEARCH_API_URI + queryParams)
         .then((res)=> res.json())
         .then(
            (result) => {
                console.log('API success', result);

                if (result.items && result.items.length !== 0) {
                    const firstItem = result.items[0];
                    setVideoId(firstItem.id.videId);
                }
            },
            (error) => {
                console.error(error);
            }
         );

    }, [])};


  return (
    <Stack gap="3rem">
      <Box>
        {/* TODO; テキスト入力後、候補がでてきて選べる仕様にしたい */}
        <TextField
          placeholder="検索ワードを入力"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={searchVideos}>
                <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ m: 1 }}
        />
      </Box>
      <Box>
        <Typography>最近見た動画</Typography>
        <Box
          height="15rem"
          sx={{
            width: "100%",
            border: 1,
          }}
        >
          <Typography>検索結果</Typography>
          <iframe
      id="player"
      width="640"
      height="360"
      src={"https://www.youtube.com/embed/" + videoId}
      frameBorder="0"
      allowFullScreen
    />
        </Box>
      </Box>
    </Stack>
  )
}

export default SearchResults
