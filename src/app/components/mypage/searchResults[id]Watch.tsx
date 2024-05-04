import React, { useState, useEffect } from "react";
import { Data, Item } from "@/types";
import { videoDataState } from "@/app/states/videoDataState";
import { db } from "../../../../libs/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useRecoilValue, useRecoilState } from "recoil";
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
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import { Memo, MemoList } from "@/types";
import YouTube from "react-youtube";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const Watch = ({ id }: { id: string }) => {
  const videoId = id;
  const [YTPlayer, setYTPlayer] = useState<YT.Player>();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [timeToShow, setTimeToShow] = useState<string>("0");
  const [newMemo, setNewMemo] = useState<Memo>({
    videoId: "",
    videoTitle: "",
    createdTime: "",
    createdAt: "",
    content: "",
  });
  const [relatedMemoList, setRelatedMemoList] = useState<MemoList>();
  const [videoData, setVideoData] = useRecoilState(videoDataState);
  const [memoMode, setMemoMode] = useState<boolean>(false);

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

    console.log(secToTime(currentTime));
    setTimeToShow(secToTime(currentTime));
  }, [currentTime]);

  useEffect(() => {
    console.log(videoData);
  }, []);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient) {
    const storedVideoData = localStorage.getItem("videoData");
    if (storedVideoData) {
      setVideoData(JSON.parse(storedVideoData));
    }
  }

  const backToPreviousUI = () => {
    setMemoMode(!memoMode);
  };

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
      createdTime: serverTimestamp(),
      createdAt: timeToShow,
      content: newMemo.content,
    });

    //firebaseから新しく加えたメモを含むメモリストを取得
    const fetchRelatedMemoList = async () => {
      const querySnapshot = await getDocs(collection(db, "memoList"));
      const memoList: MemoList = {
        memos: querySnapshot.docs.map((doc) => {
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
        }),
      };
      setRelatedMemoList(memoList);
    };
    fetchRelatedMemoList();
  };

  const editNewMemo = (e: React.ChangeEvent<HTMLInputElement>) => {
    videoData?.forEach((item) => {
      if (item.id.videoId === videoId) {
        setNewMemo((state) => ({
          ...state,
          videoId: videoId,
          videoTitle: item.snippet.title,
          content: e.target.value,
        }));
      }
    });
    console.log(newMemo);
  };

  useEffect(() => {
    const fetchRelatedMemoList = async () => {
      const querySnapshot = await getDocs(collection(db, "memoList"));
      const memoList: MemoList = {
        memos: querySnapshot.docs.map((doc) => {
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
        }),
      };
      setRelatedMemoList(memoList);
    };
    fetchRelatedMemoList();
  }, []);


  // 経過時間を秒単位に変換する関数
  const convertToSeconds = (createdAt:string) => {
    const [hours, minutes, seconds] = createdAt.split(':').map(Number);
    //秒単位に変換
    return hours * 3600 + minutes * 60 + seconds;
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
          {videoData?.map((item, index) => {
            if (item.id.videoId === videoId) {
              return (
                <div key={index}>
                  <p>{item.snippet.title}</p>
                </div>
              );
            }
            return null;
          })}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="20%">再生位置</TableCell>
              <TableCell align="left">メモ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {relatedMemoList?.memos
              ?.filter((memo) => memo.videoId === videoId)
              .sort(
                (a, b) => {
                  //経過時間を秒単位に変換して比較
                  const timeA = convertToSeconds(a.createdAt);
                  const timeB = convertToSeconds(b.createdAt);
                  return timeA - timeB;
                }
              )
              .map((memo, id) => (
                <TableRow key={id}>
                  <TableCell>{memo.createdAt}</TableCell>
                  <TableCell>{memo.content}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Watch;
