import React, { useState, useEffect } from "react";
import { videoDetails } from "@/app/states/videoDataState";
import { db } from "../../../../libs/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
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
import { Memo, MemoList,MemosByVideoId } from "@/types";
import YouTube from "react-youtube";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const Watch = ({ id }: { id: string }) => {
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
  });
  const [memoList, setMemoList] = useState<MemoList>();
  const [videoData, setVideoData] = useRecoilState(videoDetails);
  const [memoMode, setMemoMode] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  // todo: 多分修正対象
  const [memoListByVideoId, setMemoListByVideoId] = useState<MemosByVideoId>(
    {}
  );
  const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);

  const opts = {
    width: "70%",
    height: "400px",
    aspectRatio: "0.5",
  };

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

  useEffect(() => {
    console.log(videoData);
  }, []);

  const backToPreviousUI = () => {
    setMemoMode(!memoMode);
  };

  useEffect(() => {
    const fetchMemoList = async () => {
      const querySnapshot = await getDocs(collection(db, "memoList"));
      const memoList: MemoList = 
        querySnapshot.docs.map((doc) => {
          const { videoId, videoTitle, videoThumbnail, createdTime, createdAt, content } =
            doc.data();

          return {
            id: doc.id,
            videoId,
            videoTitle,
            videoThumbnail: videoThumbnail,
            createdTime,
            createdAt,
            content,
          };
          
        }) 
        setMemoList(memoList);
    };
    fetchMemoList();
  
  }, []);

  const saveMemoToFirebaseAndfetchAll = async () => {
    // * 現在の日付を取得
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
    });

    //firebaseから新しく加えたメモを含むメモリストを取得
    const fetchNewMemoList = async () => {
      const querySnapshot = await getDocs(collection(db, "memoList"));
      const memoList: MemoList = 
        querySnapshot.docs.map((doc) => {
          const { videoId, videoTitle, videoThumbnail, createdTime, createdAt, content } =
            doc.data();

          return {
            id: doc.id,
            videoId,
            videoThumbnail: videoThumbnail,
            videoTitle,
            createdTime,
            createdAt,
            content,
          };
        })
      
      setMemoList(memoList);
      
    };
    fetchNewMemoList();
    console.log(memoList);
  };

  // 説明加える
  const editNewMemo = (e: React.ChangeEvent<HTMLInputElement>) => {
           setNewMemo((memo) => ({
          ...memo,
          videoId: videoData.videoId,
          videoTitle: videoData.videoTitle,
          videoThumbnail: videoData.videoThumbnail,
          content: e.target.value,
        }));   
    console.log(newMemo);
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

    // 変更内容が反映されない箇所から
    const handleContentChange = (videoId: string, memoId: string, newContent:string) => {
      const updatedMemoListByVideoId = { ...memoListByVideoId };
  const memos = updatedMemoListByVideoId[videoId]|| [];
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

      // メモ内容をフロントエンドで変更
  const updateContent = (
    videoId: string,
    memoId: string,
    newContent: string
  ) => {
    const updatedMemoListByVideoId = { ...memoListByVideoId };
    const memos = updatedMemoListByVideoId[videoId];
    console.log(memos);
    console.log(updatedMemoListByVideoId);
    console.log(memoList)
    // const updatedMemos = memos.map((memo:any) => {
    //   if (memo.id === memoId) {
    //     return { ...memo, content: newContent };
    //   }
    //   return memo;
    // });

    // updatedMemoListByVideoId[videoId] = updatedMemos;
    // setMemoListByVideoId(updatedMemoListByVideoId);
    // console.log(updatedMemoListByVideoId);
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
    };

  return (
    <Box>
      <Box height="100%">
        <YouTube videoId={videoId} opts={opts} onReady={makeYTPlayer} />

        <Typography></Typography>
      </Box>
      <Box>
        {memoMode ? (
          <Box sx={{ width: "70%" }}>
            <Box
              display="flex"
              alignItems="center"
              paddingTop="0.5rem"
              paddingBottom="0.5rem"
              marginTop="0.5rem"
              sx={{ border: 1 }}
            >
              <Typography
                sx={{
                  paddingBottom: "0.3rem",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  marginLeft: "1rem",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  whiteSpace: "nowrap", // 追加: テキストの折り返しを防ぐ
                }}
              >
                {timeToShow}
              </Typography>
              <TextField
                variant="standard"
                placeholder="ここにメモを記入"
                value={newMemo.content}
                onChange={editNewMemo}
                InputProps={{
                  disableUnderline: true, // <== added this
                }}
                sx={{ width: "100%" }}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Box marginRight="1rem">
                <Button
                  sx={{ border: 1, width: "100%" }}
                  onClick={(
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => setMemoMode(!memoMode)}
                >
                  キャンセル
                </Button>
              </Box>
              <Box>
                <Button
                  sx={{ border: 1, width: "100%" }}
                  onClick={() => {
                    backToPreviousUI();
                    saveMemoToFirebaseAndfetchAll();
                  }}
                >
                  保存する
                </Button>
              </Box>
            </Box>
          </Box>
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

      <TableContainer sx={{ marginBottom: "50px" }}>
        <Typography variant="h3" fontWeight="650" sx={{ fontSize: "1rem" }}>
        {videoData ? videoData.videoTitle : "Loading..."}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="20%">再生位置</TableCell>
              <TableCell align="left">メモ</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {memoList?.filter((memo) => memo.videoId === videoData.videoId)
              .sort((a, b) => {
                //経過時間を秒単位に変換して比較
                const timeA = convertToSeconds(a.createdAt);
                const timeB = convertToSeconds(b.createdAt);
                return timeA - timeB;
              })
              .map((memo, id) => (
                <TableRow key={id}>
                  <TableCell>{memo.createdAt}</TableCell>
                  <TableCell>
                            {/* 編集モードと表示モードの切り替え */}
                            {!editMode ? (
                              <>
                                <TableCell>{memo.content}</TableCell>
                                <TableCell>
                                <Button
                                  variant="outlined"
                                  onClick={() => setEditMode(!editMode)}
                                >
                                  編集
                                </Button>
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TextField
                                  value={memo.content}
                                  onChange={(e)=>updateContent(memo.videoId, memo.id, e.target.value)}
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
                              削除（削除予定）
                            </Button>
                          </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Watch;
