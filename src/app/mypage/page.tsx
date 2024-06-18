"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../lib/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import {
  Box,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import {
  MemosByVideoId,
  LatestTimestampByVideoId,
  FetchedMemo,
} from "../../types";
import CustomCard from "../components/elements/cards/CustomCardsForSettings";
import RecentMemos from "../components/elements/lists/RecentMemos";

function Mypage() {
  const router = useRouter();
  const { currentUser }: any = useAuth();
  const [memoListByVideoId, setMemoListByVideoId] = useState<MemosByVideoId>(
    {}
  );
  const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [sortedVideoIds, setSortedVideoIds] = useState<string[]>([]);

  if (!currentUser) router.replace("/signin"); // ログインしていなければサインインページへ転

  // マウント時、データ削除時、編集キャンセル時にfirebaseからデータ取得
  const fetchMemoList = async () => {
    try {
      const userMemos = query(
        collection(db, "memoList"),
        where("uid", "==", currentUser.uid)
      );
      const memoSnapshot = await getDocs(userMemos);
      const memos: FetchedMemo[] = memoSnapshot.docs.map((doc) => {
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
          videoThumbnail,
          videoTitle,
          createdTime,
          createdAt,
          content,
          uid,
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
    <>
      <Box sx={{ width: "100%", textAlign: "center", mb: 5 }}>
        <Typography variant="h3">マイページ</Typography>
      </Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        最近メモを取った動画
      </Typography>

      {Object.keys(memoListByVideoId).length === 0 ? (
        <Typography variant="h6" sx={{ mb: 10 }}>
          まだ登録されたメモがありません
        </Typography>
      ) : (
        <RecentMemos
          memoListByVideoId={memoListByVideoId}
          sortedVideoIds={sortedVideoIds}
        />
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          gap: 3,
          mb: 3,
          mt: {
            xs: "1em",
            md: "2em",
          },
        }}
      >
        <CustomCard
          href="/memoList"
          icon={
            <>
              <OndemandVideoIcon />
              <FormatListBulletedIcon />
            </>
          }
          label="メモ一覧を見る"
        />
        <CustomCard
          href="/search"
          icon={
            <>
              <SearchIcon />
            </>
          }
          label="検索ページへ"
        />
      </Box>
    </>
  );
}

export default Mypage;
