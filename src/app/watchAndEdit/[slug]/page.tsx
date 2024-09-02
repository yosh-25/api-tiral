"use client";
import React, { useState, useEffect } from "react";
import { videoDetails } from "@/atoms";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRecoilValue } from "recoil";
import { Button, Typography, Box } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { Memo, MemoList } from "@/types/index";
import YouTubePlayer from "@/app/components/YoutubePlayer";
import NewMemo from "@/app/components/elements/lists/NewMemo";
import MemoListForWatchAndEdit from "@/app/components/elements/lists/MemoListForWatchAndEdit";
import { secToTime, convertToSeconds } from "@/utils/utils";
import {
  fetchMemoList,
  fetchVideoInfo,
  saveMemoToFirebase,
  updateMemoContent,
  deleteMemo,
} from "@/utils/firebaseUtils";

const WatchAndEdit = () => {
  const [YTPlayer, setYTPlayer] = useState<YT.Player>();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [timeToShow, setTimeToShow] = useState<string>("0");
  const [newMemo, setNewMemo] = useState<Memo>({
    id: "",
    videoId: "",
    videoTitle: "",
    videoThumbnail: "",
    createdTime: Timestamp.now(),
    createdAt: "",
    content: "",
    isEditing: false,
    uid: "",
  });
  const [memoList, setMemoList] = useState<MemoList>();
  const videoData = useRecoilValue(videoDetails);
  const [memoMode, setMemoMode] = useState<boolean>(false);
  const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const videoId: string = Array.isArray(params.slug)
    ? params.slug.join(" ")
    : params.slug;
  const { currentUser }: { currentUser: User | null } = useAuth();

  useEffect(() => {
    // ログインしていなければサインインページへ転送
    if (!currentUser) {
      router.replace("/signin");
      return;
    }

    // userの該当動画へのメモを取得
    // 保存、削除時も再度fetch
    const fetchData = async () => {
      const fetchedMemoList = await fetchMemoList(currentUser.uid);
      setMemoList(fetchedMemoList);

      const videoId = Array.isArray(params.slug)
        ? params.slug.join(" ")
        : params.slug;
      const videoInfo = await fetchVideoInfo(videoId);
      setNewMemo((memo) => ({
        ...memo,
        videoId: videoInfo?.videoId || videoId,
        videoTitle: videoInfo?.videoTitle || videoData?.videoTitle,
        videoThumbnail: videoInfo?.videoThumbnail || videoData?.videoThumbnail,
      }));
    };

    fetchData();
  }, [currentUser, router, params.slug, videoData, fetchTrigger]);

  const makeYTPlayer = (e: { target: YT.Player }) => {
    setYTPlayer(e.target);
  };

  // 動画の再生位置を取得し更新
  useEffect(() => {
    const interval = setInterval(() => {
      if (YTPlayer && YTPlayer.getCurrentTime) {
        setCurrentTime(YTPlayer.getCurrentTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [YTPlayer]);

  // 表示する時間を調整
  useEffect(() => {
    setTimeToShow(secToTime(currentTime));
  }, [currentTime]);

  // Firebaseに新しいメモを保存
  const handleSaveMemo = async () => {
    if (!newMemo.content.trim()) return;
    const currentTimestamp = Timestamp.now();
    setNewMemo((state) => ({ ...state, createdTime: currentTimestamp }));
    await saveMemoToFirebase(newMemo, currentUser, timeToShow);
    setFetchTrigger(!fetchTrigger);
    setNewMemo({ ...newMemo, content: "" });
  };

  // UI上で編集中の新規メモを表示
  const editNewMemo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMemo((newMemo) => ({ ...newMemo, content: e.target.value }));
  };

  // UI上で編集中の既存メモを表示
  const updateContent = (
    memoId: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newContent = e.target.value;
    setMemoList((previousMemoList) =>
      previousMemoList?.map((memo) =>
        memo.id === memoId ? { ...memo, content: newContent } : memo
      )
    );
  };

  // 編集モードを切り替える
  const toggleEditMode = (memoId: string) => {
    setEditingMemoId((prevId) => (prevId === memoId ? null : memoId));
  };

  // Firebaseでメモを削除
  const handleDeleteMemo = async (id: string) => {
    await deleteMemo(id);
    setFetchTrigger(!fetchTrigger);
  };

  return (
    <Box sx={{ width: { lg: "90%" }, mb: "40px" }}>
      <Box sx={{ width: { xs: "100%", lg: "85%" } }}>
        <YouTubePlayer videoId={videoId} onReady={makeYTPlayer} />
      </Box>
      <Box sx={{ m: { xs: "8px", sm: 0 } }}>
        <Box sx={{ mt: "16px", mb: "32px" }}>
          {memoMode ? (
            <NewMemo
              timeToShow={timeToShow}
              newMemo={newMemo}
              editNewMemo={editNewMemo}
              onSave={handleSaveMemo}
              onCancel={() => {
                setMemoMode(!memoMode);
                setNewMemo({ ...newMemo, content: "" });
              }}
            />
          ) : (
            <Box>
              <Button onClick={() => setMemoMode(!memoMode)}>
                <Typography
                  sx={{ border: 1, p: { xs: "10px", sm: "16px" }, mb: "16px" }}
                >
                  {timeToShow}にメモを作成します
                </Typography>
              </Button>
            </Box>
          )}
        </Box>
        <MemoListForWatchAndEdit
          memoList={memoList || []}
          videoId={videoId}
          convertToSeconds={convertToSeconds}
          onDelete={handleDeleteMemo}
          onEdit={(memo) => updateMemoContent(memo.id, memo.content)}
          onUpdate={updateContent}
          toggleEditMode={toggleEditMode}
          editingMemoId={editingMemoId}
          ytPlayer={YTPlayer}
        />
      </Box>
    </Box>
  );
};
export default WatchAndEdit;
