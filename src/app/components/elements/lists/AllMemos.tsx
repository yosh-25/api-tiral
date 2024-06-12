import React, { useState, useEffect } from "react";
import { videoDetails } from "@/app/states/videoDataState";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";
import { db } from "../../../../../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { useRecoilState } from "recoil";
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
import { Memo, MemoList, MemosByVideoId } from "@/types";
import YouTube from "react-youtube";
import CustomCardsForMemoList from "../cards/CustomCardsForMemoList";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const ShowAllMemos = ({ id }: { id: string }) => {
  const videoId = id;
  const [YTPlayer, setYTPlayer] = useState<YT.Player>();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [timeToShow, setTimeToShow] = useState<string>("0");
  const [newMemo, setNewMemo] = useState<Memo>({
    id: "",
    videoId: "",
    videoTitle: "",
    videoThumbnail: "",
    createdTime: "",
    createdAt: "",
    content: "",
    isEditing: false,
    uid: "",
  });
  const [memoList, setMemoList] = useState<MemoList>();
  const [videoData, setVideoData] = useRecoilState(videoDetails);
  const [memoMode, setMemoMode] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);

  const router = useRouter();
  const { currentUser }: any = useAuth();
  if (!currentUser) router.replace("/signin"); // ログインしていなければサインインページへ転



  useEffect(() => {
    const secToTime = (seconds: number) => {
      const hour = Math.floor(seconds / 3600);
      const min = Math.floor((seconds % 3600) / 60);
      const sec = Math.floor(seconds % 60);
      let time = "";
      if (hour > 0) {
        time += `${hour}:`;
      }

      if (min > 0 || hour > 0) {
        time += `${min < 10 ? "0" + min : min}:`;
      } else {
        // 時間も分も0の場合、'0:'を先に追加
        time += "0:";
      }

      // 秒は常に二桁で表示
      time += `${sec < 10 ? "0" + sec : sec}`;

      return time;
    };
    setTimeToShow(secToTime(currentTime));
  }, [currentTime]);

  useEffect(() => {
    const fetchMemoList = async () => {
      const q = query(
        collection(db, "memoList"),
        where("uid", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const memoList: MemoList = querySnapshot.docs.map((doc) => {
        const {
          videoId,
          videoTitle,
          videoThumbnail,
          createdTime,
          createdAt,
          content,
          uid,
        } = doc.data();

        return {
          id: doc.id,
          videoId,
          videoTitle,
          videoThumbnail: videoThumbnail,
          createdTime,
          createdAt,
          content,
          uid,
        };
      });
      setMemoList(memoList);
    };
    fetchMemoList();
  }, []);

  const memosByVideoId = memoList?.reduce((acc, memo) => {
    if (!acc[memo.videoId]) {
      acc[memo.videoId] = [];
    }
    acc[memo.videoId].push(memo);
    return acc;
  }, {} as MemosByVideoId);

  return (
    <Box>
      {memosByVideoId && Object.entries(memosByVideoId).map(([videoId, memos]) => (
        <CustomCardsForMemoList key={videoId} videoId={videoId} memos={memos} />
      ))}
    </Box>
  );
};

export default ShowAllMemos;