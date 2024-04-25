"use client";

import React, { useState, useEffect } from "react";
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
  IconButton,
  Link,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";

import YouTube from "react-youtube";

const watch = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [YTPlayer, setYTPlayer] = useState<YT.Player>();
  const [currentTime, setCurrentTime] = useState<number>();
  const opts = {
    width: "70%",
    height: "400px",
    aspectRatio: "0.5",
  };

  const makeYTPlayer = (e: { target: YT.Player }) => {
    setYTPlayer(e.target);
  };

  const recordCurrentTime = () => {

    setCurrentTime(YTPlayer?.getCurrentTime());
  };

  const showCurrentTime = () => {
    console.log(currentTime);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (YTPlayer && YTPlayer.getCurrentTime) {
        setCurrentTime(YTPlayer.getCurrentTime());
      }
    }, 1000); // Update time every second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [YTPlayer]);

  return (
    <Box>
      <Box height="100%">
        <YouTube videoId={id} opts={opts} onReady={makeYTPlayer} />

        <Typography></Typography>
      </Box>
      <Button onClick={recordCurrentTime}>
      <Typography sx={{ border: 1, padding: "1rem" }}>
      Current time: {currentTime?.toFixed(0)} seconds
        ここに新しいメモを作成します＋
      </Typography>
      </Button>
      <Button onClick={showCurrentTime}>
      <Typography sx={{ border: 1, padding: "1rem" }}>
        console.log用のやつ
      </Typography>
      </Button>
      <Typography sx={{ padding: "1rem" }}>
        メモを作成するとマイページで登録したメモ一覧も見れて、いろんな動画の見直しにも便利です。
      </Typography>
      <TableContainer sx={{ marginBottom: "50px" }}>
        <Typography variant="h3" fontWeight="650" sx={{ fontSize: "1rem" }}>
          React入門
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="20%">再生位置</TableCell>
              <TableCell align="left">メモ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>15:15</TableCell>
              <TableCell>useStateの書き方と注意事項</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>20:00</TableCell>
              <TableCell>
                useEffectで特定のuseStateが変更されたときにレンダリングする方法
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default watch;
