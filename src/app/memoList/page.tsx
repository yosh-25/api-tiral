"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../lib/firebase";
import ShowAllMemos from "../components/elements/lists/AllMemos";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
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
  Pagination,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BackspaceIcon from "@mui/icons-material/Backspace";

import { SelectChangeEvent } from "@mui/material/Select";
import {
  MemoList,
  Memo,
  PageApi,
  MemosByVideoId,
  TimestampsByVideoId,
  LatestTimestampByVideoId,
  FetchedMemo,
} from "../../types";
import YouTube from "react-youtube";
import MainButton from "../components/elements/buttons/mainButton";

function showMemoList() {
  const router = useRouter();
  const { currentUser }: any = useAuth();
  const YOUTUBE_SEARCH_API_URI = "https://www.googleapis.com/youtube/v3/search";
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const [memoListByVideoId, setMemoListByVideoId] = useState<MemosByVideoId>(
    {}
  );
  const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [sortedVideoIds, setSortedVideoIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [YTPlayer, setYTPlayer] = useState<YT.Player>();

  //pageApi
  const [pageApi, setPageApi] = useState<PageApi>({});
  const [rowsPerPage, setRowsPerPage] = useState(3);

  if (!currentUser) router.replace("/signin"); // ログインしていなければサインインページへ転

  // ページ番号を更新するハンドラ
  const handleChangePage = (videoId: string, event: any, value: number) => {
    setPageApi((prev) => ({
      ...prev,
      [videoId]: value,
    }));
  };

  // マウント時、データ削除時、編集キャンセル時にfirebaseからデータ取得
  const fetchMemoList = async () => {
    try {
      const memoSnapshot = await getDocs(collection(db, "memoList"));
      const memos: FetchedMemo[] = memoSnapshot.docs.map((doc) => {
        const {
          videoId,
          videoTitle,
          videoThumbnail,
          createdTime,
          createdAt,
          content,
        } = doc.data();

        return {
          id: doc.id,
          videoId,
          videoThumbnail,
          videoTitle,
          createdTime,
          createdAt,
          content,
        };
      });

      // videoIDごとにメモをグループ化する
      const memosGroupedByVideoId: MemosByVideoId = {};
      memos.forEach((memo) => {
        const videoId = memo.videoId;
        if (!memosGroupedByVideoId[videoId]) {
          memosGroupedByVideoId[videoId] = [];
        }
        memosGroupedByVideoId[videoId].push(memo);
      });
      setMemoListByVideoId(memosGroupedByVideoId);
    } catch (error) {
      console.error("Error fetching memos:", error);
    }
    console.log(memoListByVideoId);
  };

  useEffect(() => {
    fetchMemoList();
  }, [fetchTrigger, editMode]);

  // リスト内で前方一致のメモを抽出
  const searchContents = (searchQuery: string) => {
    const searchItem = searchQuery.toLowerCase();
    const matchingMemos: MemosByVideoId = {};
    Object.entries(memoListByVideoId).forEach(([videoId, memos]) => {
      memos.forEach((memo) => {
        if (memo.content.toLowerCase().includes(searchItem)) {
          if (!matchingMemos[videoId]) {
            matchingMemos[videoId] = [];
          }
          matchingMemos[videoId].push(memo);
        }
      });
    });
    setMemoListByVideoId(matchingMemos);
    console.log(matchingMemos);
  };

  // 各videoIdで直近のメモ作成日を抽出し、それを順番に並べ表示順を決める。
  const getLatestTime = (): LatestTimestampByVideoId => {
    const latestCreatedTimes: LatestTimestampByVideoId = {};
    Object.entries(memoListByVideoId).forEach(([videoId, memos]) => {
      const latestCreatedTime = memos
        .map((memo) => memo.createdTime)
        .sort(
          (a, b) => b.seconds - a.seconds || b.nanoseconds - a.nanoseconds
        )[0];
      latestCreatedTimes[videoId] = latestCreatedTime;
    });
    console.log("Latest created times by videoId:", latestCreatedTimes);
    return latestCreatedTimes;
  };

  const sortVideoIdsByLatestTimestamp = (
    listOfLatestTimesByVideo: LatestTimestampByVideoId
  ): string[] => {
    console.log("List of latest times by video:", listOfLatestTimesByVideo);
    const sortedVideoIds = Object.entries(listOfLatestTimesByVideo)
      .sort(([, timeA], [, timeB]) => {
        const dateA = timeA.toDate();
        const dateB = timeB.toDate();
        console.log(`Comparing ${dateA} and ${dateB}`); // デバッグログ追加
        return dateB.getTime() - dateA.getTime();
      })
      .map(([videoId]) => videoId);
    console.log("Sorted video IDs by latest timestamp:", sortedVideoIds);
    return sortedVideoIds;
  };

  // メモリストをソートして状態を更新する
  useEffect(() => {
    const listOfLatestTimesByVideo = getLatestTime();
    const sortedVideoIds = sortVideoIdsByLatestTimestamp(
      listOfLatestTimesByVideo
    );
    console.log("Setting sortedVideoIds:", sortedVideoIds);
    setSortedVideoIds(sortedVideoIds);
  }, [memoListByVideoId]);

 
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "80%",
        }}
      >
        <Typography variant="h3" sx={{ 
          fontSize: {
            xs: '2em',
            md: '3em'
          },
          textAlign: "center", 
          mb: "1em" }}>
          メモ一覧
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            width: "100%",
          }}
        >
          <TextField
            label="メモを検索"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 4, width: "20em" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => searchContents(searchQuery)}
                  >
                    <SearchIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => fetchMemoList()}>
                    <BackspaceIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
      <ShowAllMemos />
    </Box>
  );
}
export default showMemoList;
