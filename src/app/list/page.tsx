"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { MemoList, Memo } from "../../types";

function showWordList() {
  const router = useRouter();
  const [memoListByVideoId, setMemoListByVideoId] = useState<
    Record<string, Memo[]>
  >({});

  useEffect(() => {
    const fetchMemoList = async () => {
      try {
        const memoSnapshot = await getDocs(collection(db, "memoList"));
        const memos = memoSnapshot.docs.map((doc) => {
          const { videoId, videoTitle, createdTime, createdAt, content } =
            doc.data();
          return {
            id: doc.id,
            videoId,
            videoTitle,
            createdTime,
            createdAt,
            content,
          };
        });

        // videoIDごとにメモをグループ化する
        const memosGroupedByVideoId = {};
        memos.forEach((memo) => {
          const videoId = memo.videoId;
          if (!memosGroupedByVideoId[videoId]) {
            memosGroupedByVideoId[videoId] = [];
          }
          memosGroupedByVideoId[videoId].push(memo);
        });
        console.log(memosGroupedByVideoId);
        setMemoListByVideoId(memosGroupedByVideoId);
      } catch (error) {
        console.error("Error fetching memos:", error);
      }
    };
    fetchMemoList();
  }, []);

  // list中身確認用　後で消す
  useEffect(() => {
    console.log(memoListByVideoId);
  }, [memoListByVideoId]);

  // 経過時間を秒単位に変換する関数
  const convertToSeconds = (createdAt: string) => {
    console.log("createdAtの値:", createdAt);
    const Numbers = createdAt.split(":").map(Number);

    if (Numbers.length === 3) {
      // 時間、分、秒が全て存在する場合の処理
      const [hours3, minutes3, seconds3] = Numbers;
      return hours3 * 3600 + minutes3 * 60 + seconds3;
    } else {
      // 分&秒または秒だけが存在する場合の処理
      const [minutes2, seconds2] = Numbers;
      return minutes2 * 60 + seconds2;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3" sx={{ textAlign: "center" }}>
        Memo List
      </Typography>

      <TableContainer sx={{ marginBottom: "50px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(memoListByVideoId).map(([videoId, memos]) => (
              <React.Fragment key={videoId}>
                {memos
                  .sort((a, b) => {
                    // 日時を秒単位に変換して比較
                    const timeA = convertToSeconds(a.createdAt);
                    const timeB = convertToSeconds(b.createdAt);
                    return timeA - timeB;
                  })
                  .map((memo, index) => (
                    <TableRow key={memo.id}>
                      <TableCell>
                        {index === 0 ? memo.videoTitle : ""}
                      </TableCell>
                      <TableCell>{memo.createdAt}</TableCell>
                      <TableCell>{memo.content}</TableCell>
                      <TableCell>
                        <Button>編集</Button>
                      </TableCell>
                      <TableCell>
                        <Button>削除</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </React.Fragment>
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
        mb={5}
      ></Box>
      <Box
        sx={{
          display: "flex",
          direction: "column",
          justifyContent: "center",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Box>
          <Button variant="contained" onClick={() => router.push(`/learn`)}>
            学習ページへのリンク（開発中だけ設置）
          </Button>
        </Box>
        <Box>
          <Button variant="contained" onClick={() => router.push(`/`)}>
            Topページへのリンク（開発中だけ設置）
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default showWordList;
