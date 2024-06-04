"use client";
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
} from "@mui/material";
import { useEffect, useState } from "react";
import { Memo, MemoList } from "@/types";
import YouTube from "react-youtube";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const router = useRouter();
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
  const [editedMemo, setEditedMemo] = useState<Memo>({
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
  const [memoMode, setMemoMode] = useState<boolean>(false);

  const backToPreviousUI = () => {
    setMemoMode(!memoMode);
  };

  const opts = {
    width: "70%",
    height: "400px",
    aspectRatio: "0.5",
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

    // 説明加える
    const editNewMemo = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewMemo((memo) => ({
        ...memo,
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

    // メモ内容をフロントエンドで変更
    const updateContent = (
      memoId: string,
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const newContent = e.target.value;
      setMemoList((previousMemoList) =>
        previousMemoList?.map((memo) =>
          memo.id === memoId ? { ...memo, content: newContent } : memo
        )
      );
    };

      // 編集モード個別切り替え
  const toggleEditMode = (memoId: string) => {
    setMemoList((prevMemoList) =>
      prevMemoList?.map((memo) =>
        memo.id === memoId ? { ...memo, isEditing: !memo.isEditing } : memo
      )
    );
  };

  // メモを保存
  const saveMemo = () =>{
        // * 現在の日付を取得
        
          const today = new Date();    
          const year = today.getFullYear();
          const month = ("0" + (today.getMonth() + 1)).slice(-2);
          const day = ("0" + today.getDate()).slice(-2);
          const currentDate = year + '-' + month + '-' + day;
          const uniqueId = uuidv4();

          setNewMemo((state) => ({
            ...state,
            cretedTime: currentDate,
            createdAt: timeToShow,
            id: uniqueId
          }));
        
    
        setMemoList((prevMemoList) => {
          const updatedMemo = {
            ...newMemo,
            createdTime: currentDate,
            createdAt: timeToShow,
            id: uniqueId
          };
          return [...(prevMemoList || []), updatedMemo];
        });
        console.log(memoList);

        setNewMemo({
          id: "",
          videoId: "",
          videoTitle: "",
          videoThumbnail: "",
          createdTime: "",
          createdAt: "",
          content: "",
          isEditing: false,
          uid: "",
        })
  };

  const updateMemoList = (id:string) => {
    setMemoList((prevMemoList)=>
    prevMemoList?.map((memo)=> 
      memo.id ===  id ? {...memo, content: newMemo.content}: memo
  ))
  setNewMemo({
    id: "",
    videoId: "",
    videoTitle: "",
    videoThumbnail: "",
    createdTime: "",
    createdAt: "",
    content: "",
    isEditing: false,
    uid: "",
  })
    };


  // メモを削除
  const deleteMemo = async (id: string) => {
    setMemoList((prevMemoList)=> prevMemoList?.filter((memo)=>memo.id !== id));
  };

  const makeYTPlayer = (e: { target: YT.Player }) => {
    setYTPlayer(e.target);
  };

  return (
    <>
     <Box>
      <Box>
        <YouTube videoId='zQnBQ4tB3ZA' opts={opts} onReady={makeYTPlayer} />
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
                    saveMemo();
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
          TypeScript in 100 Seconds
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="20%">再生位置</TableCell>
              <TableCell align="left">メモ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {memoList
              ?.sort((a, b) => {
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
                    {!memo.isEditing ? (
                      <>
                        <TableCell>{memo.content}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              toggleEditMode(memo.id),
                              setEditedMemo(memo)
                            }}
                          >
                            編集
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TextField
                          value={editedMemo.content}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditedMemo((prevNewMemo)=>({
                              ...prevNewMemo,
                              content: e.target.value
                            }))
                          }
                          size="small"
                        />
                        <Button
                          variant="contained"
                          sx={{ ml: 1 }}
                          onClick={() => {
                            updateMemoList(memo.id);
                            toggleEditMode(memo.id);
                          }}
                        >
                          保存
                        </Button>
                        <Button
                          sx={{ ml: 1 }}
                          onClick={() => toggleEditMode(memo.id)}
                        >
                          キャンセル
                        </Button>
                      </>
                    )}
                  </TableCell>

                  <TableCell>
                    <Button onClick={() => deleteMemo(memo.id)}>削除</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack alignItems="center" gap="2rem">
          <Typography variant="h1" fontSize="3rem" fontWeight="750">
            Memotube
          </Typography>
          <Typography variant="h2" fontSize="2rem" fontWeight="500">
            Youtubeで学びながら、後で見直しもできるメモ帳が作成できます。
          </Typography>
          <Box
            height="28rem"
            sx={{
              width: "100%",
              border: 1,
            }}
          >
            <Typography>ここにサンプル動画を表示予定　React入門</Typography>
          </Box>
          <Typography sx={{ border: 1, padding: "1rem" }}>
            0:05に新しいメモを作成します＋
          </Typography>
          <Typography sx={{ padding: "1rem" }}>
            メモを作成するとマイページで登録したメモ一覧も見れて、いろんな動画の見直しにも便利です。
          </Typography>
          <TableContainer sx={{ marginBottom: "50px" }}>
            <Typography variant="h3" fontWeight="650" sx={{ fontSize: "1rem" }}>
              React入門
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="20%">再生位置</TableCell>
                  <TableCell align="left">メモ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>15:15</TableCell>
                  <TableCell>useStateの書き方と注意事項</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>20:00</TableCell>
                  <TableCell>
                    useEffectで特定のuseStateが変更されたときにレンダリングする方法
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer sx={{ marginBottom: "50px" }}>
            <Typography variant="h3" fontWeight="650" sx={{ fontSize: "1rem" }}>
              API入門
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="20%">再生位置</TableCell>
                  <TableCell align="left">メモ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>15:15</TableCell>
                  <TableCell>CORSエラー解消方法</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>20:00</TableCell>
                  <TableCell>proxyの設定の仕方</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    </>
  );
}
