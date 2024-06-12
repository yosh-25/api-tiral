"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../lib/firebase";
import { getDocs, collection } from "firebase/firestore";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  IconButton,
} from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  MemosByVideoId,
  LatestTimestampByVideoId,
  FetchedMemo,
} from "../../types";
import CustomCard from "../components/elements/cards/CustomCardsForSettings";
import MainButton from "../components/elements/buttons/mainButton";

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
      const memoSnapshot = await getDocs(collection(db, "memoList"));
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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          gap: 3,
        }}
      >
        {sortedVideoIds.slice(0, 3).map((videoId) => {
          const memos = memoListByVideoId[videoId] || [];
          const memosToShow = memos.slice(0, 2);

          return (
            <Box
              key={videoId}
              sx={{
                display: "flex",
                flexDirection: "column",
                width: {
                  xs: "100%", // モバイル (0px 以上): 幅100%
                  md: "45%", // 中程度の画面 (900px 以上): 幅30%
                  lg: "30%", //
                },
                mb: 2,
                border: "1px solid #ccc",
                padding: 2,
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2, // 行数の制限を指定
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "1.5em", // 行間の高さを設定
                  height: "3em", // 2行分の高さを設定
                  mb: 1,
                }}
              >
                {memosToShow[0]?.videoTitle}
              </Typography>
              <Link
                href={
                  "searchResults/" + memosToShow[0]?.videoId + "/watchAndEdit"
                }
              >
                <img
                  src={memosToShow[0]?.videoThumbnail}
                  alt="Thumbnail"
                  style={{ width: "100%", borderRadius: "4px" }}
                />
              </Link>
              <TableContainer
                sx={{
                  marginBottom: "10px",
                  height: {
                    lg: "8em",
                  },
                }}
              >
                <Table>
                  <TableBody>
                    {memosToShow.map((memo, uid) => (
                      <TableRow key={uid}>
                        <TableCell>{memo.createdAt}</TableCell>
                        <TableCell>{memo.content}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center", // 水平方向の中央配置
                  alignItems: "center",
                }}
              >
                <Link href={"searchResults/" + videoId + "/watchAndEdit"}>
                  <MainButton >
                    メモを編集/動画を視聴
                  </MainButton>
                </Link>
              </Box>
              <Typography variant="body2" sx={{ textAlign: "right", mt: 2 }}>
                {memos.length >= 2 ? "2" : "1"}/{memos.length}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          gap: 3,
          mt: {
            xs: '1em',
            md: '2em'}
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
          href="/settings"
          icon={
            <>
              <SettingsIcon />
            </>
          }
          label="個人設定(Coming soon?)"
        />
      </Box>
    </>
  );
}

export default Mypage;
