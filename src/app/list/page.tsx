"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../libs/firebase";
import { videoDataState } from "@/app/states/videoDataState";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  deleteDoc,
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
  Link
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { MemoList, Memo, PageApi } from "../../types";
import YouTube from "react-youtube";

function showMemoList() {
  const router = useRouter();
const YOUTUBE_SEARCH_API_URI = "https://www.googleapis.com/youtube/v3/search";
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const [memoListByVideoId, setMemoListByVideoId] = useState<
    Record<string, Memo[]>
  >({});
  const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
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

  // マウント時、データ削除時、編集キャンセル時にfirebaseからデータ取得
  useEffect(() => {
    const fetchMemoList = async () => {
      try {
        const memoSnapshot = await getDocs(collection(db, "memoList"));
        const memos = memoSnapshot.docs.map(doc => doc.data()).sort((a,b) => {
          return convertToSeconds(a.createdAt) - convertToSeconds(b.createdAt);
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
  }, [fetchTrigger, editMode]);

  // VideoId毎のサムネを取得
  const getVideoThumbnail = async (videoId: string) => {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`;
    try {
      const response = await fetch(url);
      if(!response.ok) {
        console.error('Network response was not ok');
      }
      const data = await response.json();
      const video = data.items?.[0];
      if(video) {
        const thumbnails = video.snippet?.thumbnails;
        if (thumbnails) {
          console.log('Medium thumbnail URL', thumbnails.medium?.url);
        } else {
        console.log('No thumbnail');
      } }else {
        console.log('video not found');
      }
    } catch(error) {
      console.error('Failed to fetch', error);
    }
  };
 


  // list中身確認用　後で消す
  useEffect(() => {
    console.log(memoListByVideoId);
  }, [memoListByVideoId]);

  // 経過時間を秒単位に変換する関数
  const convertToSeconds = (createdAt: string) => {
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
    try {
      await deleteDoc(doc(db, "memoList", id));
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

      {Object.entries(memoListByVideoId).map(([videoId, memos]) => {
        const currentPage = pageApi[videoId] || 1;
        const memosToShow = memos.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        );

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
              {memosToShow.map(
                (memo, index) =>
                  index === 0 && (
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Box>
                        <Typography variant="h6" key={index}>
                          {memo.videoTitle}
                        </Typography>
                      </Box>
                      <Box>
                      <Link href={"mypage/searchResults/" + memo.videoId + "/watch"}>
                      <img
                    src={memo.videoThumbnail}
                    alt={'error'}
                  />
                        </Link>
                      </Box>
                    </Box>
                  )
              )}
              <Box>
                {memosToShow            
                  .map((memo, index) => (
                    <TableContainer key={`${memo.id}-${index}`} sx={{ marginBottom: "10px" }}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row">
                              {memo.createdAt}
                            </TableCell>
                            <TableCell>{memo.content}</TableCell>
                            <TableCell>
                              {/* 編集モードと表示モードの切り替え */}
                              {!editMode ? (
                                <Button
                                  variant="outlined"
                                  onClick={() => setEditMode(!editMode)}
                                >
                                  編集
                                </Button>
                              ) : (
                                <>
                                  <TextField
                                    value={memo.content}
                                    onChange={(e) =>
                                      updateContent(
                                        memo.videoId,
                                        memo.id,
                                        e.target.value
                                      )
                                    }
                                    size="small"
                                  />
                                  <Button
                                    variant="contained"
                                    sx={{ ml: 1 }}
                                    onClick={() =>
                                      updateMemoContent(memo.id, memo.content)
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
                              <Button onClick={() => deleteMemo(memo.id)}>
                                削除
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ))}
                <Pagination
                  count={Math.ceil(memos.length / rowsPerPage)}
                  page={currentPage}
                  onChange={(event, value) =>
                    handleChangePage(videoId, event, value)
                  }
                  color="primary"
                />
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export default showMemoList;
