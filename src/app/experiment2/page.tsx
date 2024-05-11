'use client'
import axios from "axios";
import { useEffect, useState } from "react";
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
  Pagination
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { MemoList, Memo } from "../../types";



const experiment = () => {
    //pageApi
    const [pageApi, setPageApi] = useState({});
    const [rowsPerPage, setRowsPerPage] = useState(2);

      // ページ番号を更新するハンドラ
  const handleChangePage = (videoId:any, event:any, value:number) => {
    setPageApi(prev => ({
      ...prev,
      [videoId]: value
    }));
  };


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


  
    return (
      <>
        <Typography>App</Typography>
        {Object.entries(memoListByVideoId).map(([videoId, memos]) => {
          const currentPage = pageApi[videoId] || 1;
          const memosToShow = memos.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

          return (
            <Box key={videoId} sx={{ marginY: 1 }}>
              <Typography variant="h6">Video ID: {videoId}</Typography>
              {memosToShow.map(memo => (
                <TableContainer key={memo.id}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>{memo.createdAt}</TableCell>
                        <TableCell>{memo.content}</TableCell>
                        <TableCell>
                          <Button variant="outlined">編集</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ))}
              <Pagination
                count={Math.ceil(memos.length / rowsPerPage)}
                page={currentPage}
                onChange={(event, value) => handleChangePage(videoId, event, value)}
                color="primary"
              />
            </Box>
          );
        })}
      </>
    );
};
  
export default experiment;
