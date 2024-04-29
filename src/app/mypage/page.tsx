"use client";
import React from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Input,
  Grid,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import { videoDataState } from "@/app/states/videoDataState";
import { useRecoilState } from "recoil";

const Mypage = () => {
  const [videoData, setVideoData] = useRecoilState(videoDataState);

  if (videoData) console.log(videoData);
  else console.log("no data");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "start",
        flexDirection: "column",
      }}
    >
      <Stack gap="3rem">
        <Box>
          {/* TODO; テキスト入力後、候補がでてきて選べる仕様にしたい */}
          <TextField
            placeholder="検索ワードを入力"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
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
            <Typography>ここに直近数回で見た動画を表示</Typography>
          </Box>
        </Box>
        <Box>
          <Typography>メモ</Typography>
          <Box
            height="15rem"
            sx={{
              width: "100%",
              border: 1,
            }}
          >
            <Typography>直近5つのメモを表示</Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default Mypage;
