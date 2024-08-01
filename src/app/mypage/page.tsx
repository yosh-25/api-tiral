"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "../../lib/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import { Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import {
  MemosByVideoId,
  LatestTimestampByVideoId,
  MemoList,
} from "@/types/index";
import CustomCard from "../components/elements/cards/CustomCardsForSettings";
import RecentMemos from "../components/elements/lists/RecentMemos";

function Mypage() {
  const [memoListByVideoId, setMemoListByVideoId] = useState<MemosByVideoId>(
    {}
  );
  const [sortedVideoIds, setSortedVideoIds] = useState<string[]>([]);
  const [error, setError] = useState<string>();

  const router = useRouter();
  const { currentUser } = useAuth();

  // ログインしていなければサインインページへ
  useEffect(() => {
    if (!currentUser) {
      router.replace("/signin");
    }
  }, [currentUser]);

  // マウント時にfirebaseからデータ取得
  const fetchMemoList = async () => {
    try {
      const userMemos = query(
        collection(db, "memoList"),
        where("uid", "==", currentUser?.uid)
      );
      const memoSnapshot = await getDocs(userMemos);
      const memos: MemoList = memoSnapshot.docs.map((doc) => {
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
    } catch (error) {
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

  // メモリストをソートして状態を更新する
  useEffect(() => {
    const listOfLatestTimesByVideo = getLatestTime();
    const sortedVideoIds = sortVideoIdsByLatestTimestamp(
      listOfLatestTimesByVideo
    );
    setSortedVideoIds(sortedVideoIds);
  }, [memoListByVideoId]);

  return (
    <>
      <Box sx={{ width: "100%", textAlign: "center", mb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: {
              xs: "2em",
              md: "3em",
            },
          }}
        >
          マイページ
        </Typography>
      </Box>

      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontSize: {
            xs: "1.3em",
            md: "2em",
          },
          textAlign: {
            xs: "center",
            md: "left",
          },
        }}
      >
        最近メモを取った動画
      </Typography>

      {error ? (
        <Typography
          variant="h6"
          color="error"
          sx={{ mb: "16px", textAlign: { xs: "center", md: "left" } }}
        >
          {error}
        </Typography>
      ) : Object.keys(memoListByVideoId).length === 0 ? (
        <Typography
          variant="h6"
          sx={{ mb: "16px", textAlign: { xs: "center", md: "left" } }}
        >
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
          gap: "24px",
          mt: {
            xs: "16px",
            md: "24px",
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
