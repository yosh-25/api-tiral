"use client";
import React, { useState, useEffect } from "react";
import { videoDetails } from "@/atoms";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import { db } from "../../../lib/firebase";
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
  limit,
  Timestamp,
} from "firebase/firestore";
import { useRecoilState } from "recoil";
import { Button, Typography, Box } from "@mui/material";
import { Memo, MemoList } from "@/types/index";
import YouTubePlayer from "@/app/components/YoutubePlayer";
import NewMemo from "@/app/components/elements/lists/NewMemo";
import MemoListForWatchAndEdit from "@/app/components/elements/lists/MemoListForWatchAndEdit";

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
  const [videoData, setVideoData] = useRecoilState(videoDetails);
  const [memoMode, setMemoMode] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);

  const router = useRouter();
  const params = useParams();
  const videoId: string = Array.isArray(params.slug)
    ? params.slug.join(" ")
    : params.slug;
  const { currentUser }: any = useAuth();
  if (!currentUser) router.replace("/signin"); // ログインしていなければサインインページへ転

  const makeYTPlayer = (e: { target: YT.Player }) => {
    setYTPlayer(e.target);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (YTPlayer && YTPlayer.getCurrentTime) {
        setCurrentTime(YTPlayer.getCurrentTime());
      }
    }, 1000); // Update time every second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [YTPlayer]);

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

  // ここでメモ系のデータもまとめてfetchさせる。
  useEffect(() => {
    // 既存メモリストあれば取得
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
    // 新規メモ作成用の動画データを事前取得
    const fetchVideoInfo = async () => {
      let videoIdFromDb: string | null = null;
      let videoTitleFromDb: string | null = null;
      let videoThumbnailFromDb: string | null = null;

      try {
        // Firestoreから同じ動画のメモがあるかどうか確認する
        const q = query(
          collection(db, "memoList"),
          where("videoId", "==", videoId),
          limit(1) // 同じ動画に対する複数のメモが存在する可能性が低いため、最初の一つだけを取得
        );
        const querySnapshot = await getDocs(q);
        // メモが既に存在する場合、そのデータを使用する
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          videoIdFromDb = data.videoId;
          videoTitleFromDb = data.videoTitle;
          videoThumbnailFromDb = data.videoThumbnail;
        }
      } catch (error) {
        console.error(
          "Firestoreからメモを取得中にエラーが発生しました: ",
          error
        );
      }

      setNewMemo((memo) => ({
        ...memo,
        videoId: videoIdFromDb || videoId, // Firestoreに既存データがあればそれを使用
        videoTitle: videoTitleFromDb || videoData.videoTitle,
        videoThumbnail: videoThumbnailFromDb || videoData.videoThumbnail,
      }));
    };
    fetchMemoList();
    fetchVideoInfo();
  }, []);

  const saveMemoToFirebaseAndfetchAll = async () => {
    // メモ未記入時は無効化
    if (!newMemo.content.trim()) {
      return;
    }

    // 現在の日付を取得
    const CurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = ("0" + (today.getMonth() + 1)).slice(-2);
      const day = ("0" + today.getDate()).slice(-2);

      setNewMemo((state) => ({
        ...state,
        cretedTime: year + "-" + month + "-" + day + " ",
      }));
    };
    CurrentDate();

    //firebaseに新しいメモを追加
    await addDoc(collection(db, "memoList"), {
      videoId: newMemo.videoId,
      videoTitle: newMemo.videoTitle,
      videoThumbnail: newMemo.videoThumbnail,
      createdTime: serverTimestamp(),
      createdAt: timeToShow,
      content: newMemo.content,
      uid: currentUser.uid,
    });

    //firebaseから新しく加えたメモを含むメモリストを取得
    const fetchNewMemoList = async () => {
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
          videoThumbnail: videoThumbnail,
          videoTitle,
          createdTime,
          createdAt,
          content,
          uid,
        };
      });
      setMemoList(memoList);
    };
    fetchNewMemoList();
    setNewMemo({
      ...newMemo,
      content: "",
    });
  };

  // 説明加える
  const editNewMemo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMemo((newMemo) => ({
      ...newMemo,
      content: e.target.value,
    }));
  };

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

  // 変更したメモ内容をバックエンドに保存
  const updateMemoContent = async (id: string, newContent: string) => {
    console.log(newContent);
    if (!newContent || newContent.trim() === "") {
      console.log("新しい内容が空です。変更は保存されませんでした。");
      return;
    }
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

  // 編集モード個別切り替え
  const toggleEditMode = (memoId: string) => {
    setMemoList((prevMemoList) =>
      prevMemoList?.map((memo) =>
        memo.id === memoId ? { ...memo, isEditing: !memo.isEditing } : memo
      )
    );
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
    const querySnapshot = await getDocs(collection(db, "memoList"));
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

  return (
    <Box
      sx={{
        width: {
          lg: "90%",
        },
        mb: 5,
      }}
    >
      <Box
        sx={{
          width: {
            xs: "100%",
            lg: "85%",
          },
        }}
      >
        <YouTubePlayer videoId={videoId} onReady={makeYTPlayer} />
      </Box>
      <Box
        sx={{
          m: {
            xs: 1,
            sm: 0,
          },
        }}
      >
        <Box sx={{ mt: 2, mb: 4 }}>
          {memoMode ? (
            <NewMemo
              timeToShow={timeToShow}
              newMemo={newMemo}
              editNewMemo={editNewMemo}
              onSave={saveMemoToFirebaseAndfetchAll}
              onCancel={() => {
                setMemoMode(!memoMode);
                setNewMemo({
                  ...newMemo,
                  content: "",
                });
              }}
            />
          ) : (
            <Box>
              <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                  setMemoMode(!memoMode)
                }
              >
                <Typography
                  sx={{ border: 1, padding: "1rem", marginBottom: "1rem" }}
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
          onDelete={deleteMemo}
          onEdit={(memo) => updateMemoContent(memo.id, memo.content)}
          onUpdate={updateContent}
          toggleEditMode={toggleEditMode}
        />
      </Box>
    </Box>
  );
};
export default WatchAndEdit;
