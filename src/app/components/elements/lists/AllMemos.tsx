import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";
import { db } from "../../../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  Box,
} from "@mui/material";
import { Memo, MemoList, MemosByVideoId } from "@/types";
import CustomCardsForMemoList from "../cards/CustomCardsForMemoList";

const ShowMemos = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [timeToShow, setTimeToShow] = useState<string>("0");
  const [memoList, setMemoList] = useState<MemoList>();

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
      const memos: MemoList = querySnapshot.docs.map((doc) => {
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {memosByVideoId &&
        Object.entries(memosByVideoId).map(([videoId, memos]) => (
          <CustomCardsForMemoList
            key={videoId}
            videoId={videoId}
            memos={memos}
          />
        ))}
    </Box>
  );
};

export default ShowMemos;
