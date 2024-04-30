"use client";
import { useRouter } from "next/navigation";
import { useRecoilValue, useRecoilState } from "recoil";
import { videoDataState, counterState } from "@/app/states/videoDataState";
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
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const videoData = useRecoilValue(videoDataState);

  useEffect(() => {
    console.log(videoData?.items);
  }, []);

  return (
    <>
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

          <Button variant="contained">さっそく使ってみる</Button>
          <Button variant="contained" onClick={() => router.push(`/learn`)}>
            学習ページへのリンク（開発中だけ設置）
          </Button>
          <Button variant="contained" onClick={() => router.push(`/list`)}>
            単語リストへのリンク（開発中だけ設置）
          </Button>
        </Stack>
      </Box>
    </>
  );
}
