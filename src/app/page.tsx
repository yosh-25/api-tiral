"use client";
import { useRouter } from "next/navigation";
import { Button, Stack, TextField, Typography } from "@mui/material";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Stack
        height="100vh"
        justifyContent="center"
        alignItems="center"
        gap="32px"
      >
        <Typography variant="h1" fontSize="2rem" fontWeight="750">
          English Learning Made Easy
        </Typography>
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
