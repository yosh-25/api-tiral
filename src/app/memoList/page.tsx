"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "../../lib/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BackspaceIcon from "@mui/icons-material/Backspace";
import CustomCardsForMemoList from "@/app/components/elements/cards/CustomCardsForMemoList";
import {
  MemoList,
  MemosByVideoId,
  LatestTimestampByVideoId,
} from "@/types/index";

function ShowMemoList() {
  const router = useRouter();
  const [memoListByVideoId, setMemoListByVideoId] = useState<MemosByVideoId>(
    {}
  );
  const [sortedVideoIds, setSortedVideoIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string>();

  // ログインしていなければサインインページへ遷移
  const { currentUser } = useAuth();
  if (!currentUser) router.replace("/signin");

  // マウント時firebaseからデータ取得
  const fetchMemoList = async () => {
    try {
      const q = query(
        collection(db, "memoList"),
        where("uid", "==", currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      const memos: MemoList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          videoId: data.videoId,
          videoTitle: data.videoTitle,
          videoThumbnail: data.videoThumbnail,
          createdTime: data.createdTime,
          createdAt: data.createdAt,
          content: data.content,
          uid: data.uid,
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
      setSearchQuery("");
    } catch (e) {
      setError("メモの取得に問題が発生しました。もう一度お試しください。");
    }
  };

  useEffect(() => {
    fetchMemoList();
  }, []);

  // 各videoIdで直近のメモ作成日を抽出し、それを順番に並べ表示順を決める。
  const getLatestTime = (): LatestTimestampByVideoId => {
    const latestCreatedTimes: LatestTimestampByVideoId = {};
    Object.entries(memoListByVideoId).forEach(([videoId, memos]) => {
      const latestCreatedTime = memos
        .map((memo) => memo.createdTime)
        .sort((a, b) => {
          if (!b) return -1; // bがundefinedならaを優先
          if (!a) return 1; // aがundefinedならbを優先
          return b.seconds - a.seconds || b.nanoseconds - a.nanoseconds;
        })[0];
      latestCreatedTimes[videoId] = latestCreatedTime;
    });
    return latestCreatedTimes;
  };

  const sortVideoIdsByLatestTimestamp = (
    listOfLatestTimesByVideo: LatestTimestampByVideoId
  ): string[] => {
    const sortedVideoIds = Object.entries(listOfLatestTimesByVideo)
      .sort(([, timeA], [, timeB]) => {
        if (!timeA && !timeB) return 0; // 両方ともundefinedの場合
        if (!timeA) return 1; // timeAがundefinedの場合
        if (!timeB) return -1; // timeBがundefinedの場合

        const dateA = timeA?.toDate();
        const dateB = timeB?.toDate();
        return dateB.getTime() - dateA.getTime();
      })
      .map(([videoId]) => videoId);
    return sortedVideoIds;
  };

  useEffect(() => {
    const listOfLatestTimesByVideo = getLatestTime();
    const sortedVideoIds = sortVideoIdsByLatestTimestamp(
      listOfLatestTimesByVideo
    );
    setSortedVideoIds(sortedVideoIds);
  }, [memoListByVideoId]);

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
  };

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
        <Typography
          variant="h1"
          sx={{
            fontSize: {
              xs: "2rem",
              md: "3rem",
            },
            textAlign: "center",
            mb: "16px",
          }}
        >
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
            sx={{ mb: "32px", width: "20rem" }}
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
      
      {/* メモ取得失敗時はエラーメッセージを表示する。 */}
      {error ? (
        <Typography
          variant="h6"
          color="error"
          sx={{ width: "80%", mb: "16px", textAlign: "center" }}
        >
          {error}
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {sortedVideoIds.map(
            (videoId) =>
              memoListByVideoId && (
                <CustomCardsForMemoList
                  key={videoId}
                  videoId={videoId}
                  memos={memoListByVideoId[videoId]}
                />
              )
          )}
        </Box>
      )}
    </Box>
  );
}
export default ShowMemoList;
