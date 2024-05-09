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
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { MemoList, Memo } from "../../types";

function showWordList() {
  const router = useRouter();
  const [memoListByVideoId, setMemoListByVideoId] = useState<
    Record<string, Memo[]>
  >({});
  const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  // マウント時、データ削除時、編集キャンセル時にfirebaseからデータ取得
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
  }, [fetchTrigger, editMode]);

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
    <>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Typography variant="h3" sx={{ textAlign: "center", my: 4 }}>
        Memo List
      </Typography>

{/* 今取り組んでいる箇所 */}
        {Object.entries(memoListByVideoId).map(([videoId, memos]) => (
          <Box
          key={videoId}
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
            alignItems: "start",
            my: 2,
          }}
        >
          <Box sx={{ flex: 1, display: "flex",  alignItems: "center" }}>
            
          {memos.map((memo, index) => (
            index===0 && (
              <Box sx={{display:'flex', flexDirection: 'column'}}>
                <Box>
              <Typography variant="h6" key={index}>{memo.videoTitle}</Typography>
              </Box>
              <Box>
              <video width="320" height="240" controls>
                <source src={memo.videoUrl} type="video/mp4" />
              </video>
              </Box>
            </Box>
            )
          ))}
                  
          <Box>
            {memos
              .sort((a, b) => {
                // 日時を秒単位に変換して比較
                const timeA = convertToSeconds(a.createdAt);
                const timeB = convertToSeconds(b.createdAt);
                return timeA - timeB;
              })
              .map((memo, index) => (        
                  <TableContainer key={memo.id} sx={{ marginBottom: "50px" }}>
                    <Table>
                        <TableBody>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                         {memo.createdAt}
                         </TableCell>
                         <TableCell>{memo.content}</TableCell>
                        <TableCell>
                        {/* 編集モードと表示モードの切り替え */}
                        {!editMode ? (
                          <Button variant="outlined" onClick={() => setEditMode(!editMode)}>編集</Button>
                        ) : (
                          <>
                            <TextField
                              value={memo.content}
                              onChange={(e) => updateContent(memo.videoId, memo.id, e.target.value)}
                              size="small"
                            />
                            <Button
                              variant="contained"
                              sx={{ ml: 1 }}
                              onClick={() => updateMemoContent(memo.id, memo.content)}
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
              </Box>
              </Box>
              </Box>      
        ))}
      </Box>


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
    </>
  );
}

export default showWordList;
