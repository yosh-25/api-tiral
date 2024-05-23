"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../libs/firebase";
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
} from "@mui/material";
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

function showMemoList() {
  const router = useRouter();
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

  // ページ番号を更新するハンドラ
  const handleChangePage = (videoId: string, event: any, value: number) => {
    setPageApi((prev) => ({
      ...prev,
      [videoId]: value,
    }));
  };

  // todo 再トライ　https://zenn.dev/tentel/articles/ea7d5c03e68e6d142d98
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
  const searchContents = (searchQuery:string) => {
    const searchItem = searchQuery.toLowerCase();
    const matchingMemos: MemosByVideoId = {};
    Object.entries(memoListByVideoId).forEach(([videoId, memos]) => {
      memos.forEach((memo) => {
        if(memo.content.toLowerCase().includes(searchItem)){
          if(!matchingMemos[videoId]){
            matchingMemos[videoId] = [];
          }matchingMemos[videoId].push(memo);

        }
    });
  });
  setMemoListByVideoId(matchingMemos);
  console.log(matchingMemos);
}

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


  // メモ内容をフロントエンドで変更
  const updateContent = (
    videoId: string,
    memoId: string,
    newContent: string
  ) => {
    const updatedMemoListByVideoId = { ...memoListByVideoId };
    const memos = updatedMemoListByVideoId[videoId];
    const updatedMemos = memos.map((memo) => {
      if (memo.id === memoId) {
        return { ...memo, content: newContent };
      }
      return memo;
    });

    updatedMemoListByVideoId[videoId] = updatedMemos;
    setMemoListByVideoId(updatedMemoListByVideoId);
    console.log(updatedMemoListByVideoId);
  };

  // 変更したメモ内容をバックエンドに保存
  const updateMemoContent = async (id: string, newContent: string) => {
    const docRef = doc(db, "memoList", id);
    try {
      await updateDoc(docRef, {
        content: newContent,
      });
      console.log("変更が保存されました！");
      setEditMode(!editMode);
    } catch (error) {
      console.log("エラーが発生しました。", error);
    }
  };

  // メモを削除
  const deleteMemo = async (id: string) => {
    const memoId = id;
    console.log(memoId);
    try {
      await deleteDoc(doc(db, "memoList", memoId));
      console.log("メモを削除しました！");
      setFetchTrigger(!fetchTrigger);
    } catch (error) {
      console.log("エラーが発生しました。", error);
    }
  };

  return (
    <Box
      sx={{
        // display: "flex",
        // flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Typography variant="h3" sx={{ textAlign: "center", my: 4 }}>
        Memo List
      </Typography>

      <TextField
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 4, width: "60%" }}
      />

      <Button onClick={() => searchContents(searchQuery)}>メモを検索</Button>
      <Button onClick={() => fetchMemoList()}  >全てのメモを表示</Button>

      {sortedVideoIds.map((videoId) => {
        const memos = memoListByVideoId[videoId] || [];
        const memoToShow = memos[0]

        return (
          <Box
            key={videoId}
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
              alignItems: "start",
              my: 1,
            }}
          >
            <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
              
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Box>
                        <Typography variant="h6" key={memoToShow.videoId}>
                          {memoToShow.videoTitle}
                        </Typography>
                      </Box>
                      <Box>
                        <Link
                          href={
                            "mypage/searchResults/" + memoToShow.videoId + "/watch"
                          }
                        >
                          <img src={memoToShow.videoThumbnail} alt={"error"} />
                        </Link>
                      </Box>
                    </Box>
                  
              
              <Box>
                
                  <TableContainer
                    key={memoToShow.videoId}
                    sx={{ marginBottom: "10px" }}
                  >
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {memoToShow.createdAt}
                          </TableCell>

                          <TableCell>
                            {/* 編集モードと表示モードの切り替え */}
                            {!editMode ? (
                              <>
                                <TableCell>{memoToShow.content}</TableCell>
                                <Button
                                  variant="outlined"
                                  onClick={() => setEditMode(!editMode)}
                                >
                                  編集（削除予定）
                                </Button>
                              </>
                            ) : (
                              <>
                                <TextField
                                  value={memoToShow.content}
                                  onChange={(e) =>
                                    updateContent(
                                      memoToShow.videoId,
                                      memoToShow.id,
                                      e.target.value
                                    )
                                  }
                                  size="small"
                                />
                                <Button
                                  variant="contained"
                                  sx={{ ml: 1 }}
                                  onClick={() =>
                                    updateMemoContent(memoToShow.id, memoToShow.content)
                                  }
                                >
                                  保存
                                </Button>
                                <Button
                                  sx={{ ml: 1 }}
                                  onClick={() => setEditMode(!editMode)}
                                >
                                  キャンセル
                                </Button>
                              </>
                            )}
                          </TableCell>

                          <TableCell>
                            <Button onClick={() => deleteMemo(memoToShow.id)}>
                              削除（削除予定）
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                
                <Button >
                              メモ編集画面へ
                            </Button>
                <Typography variant="body2" sx={{ textAlign: "right", mr: 2 }}>
            1/{memos.length}
          </Typography>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export default showMemoList;
