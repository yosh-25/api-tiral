"use client";
import { useRouter } from "next/navigation";
import { Button, Stack, TextField, Typography, Box } from "@mui/material";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Stack
        height="100vh"
        alignItems="center"
        gap="32px"
      >
        <Typography variant="h1" fontSize="3rem" fontWeight="750">
          Memotube
        </Typography>
        <Typography variant='h2' fontSize='2rem' fontWeight="500">
          Youtubeで学びながら、後で見直しもできるメモ帳が作成できます。
        </Typography>
        <Box >

        </Box>
        <Button variant="contained" onClick={() => router.push(`/login`)}>
          ログイン
        </Button>
        <Button variant="contained">初めての方はこちら</Button>
        <Button variant="contained" onClick={() => router.push(`/learn`)}>学習ページへのリンク（開発中だけ設置）</Button>
        <Button variant="contained" onClick={() => router.push(`/list`)}>単語リストへのリンク（開発中だけ設置）</Button>
      </Stack>
    </>
  );
}
