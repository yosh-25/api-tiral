"use client";
import { useRouter } from "next/navigation";
import { Stack, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import Link from "next/link";
import MainButton from "./components/elements/buttons/mainButton";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const router = useRouter();
  const [YTPlayer, setYTPlayer] = useState<YT.Player>();
  const { currentUser } = useAuth();

  // 前回ログインしたままの場合メインページへ遷移
  useEffect(() => {
    if (currentUser) router.replace("/mypage");
  }, [currentUser]);

  const opts = {
    width: "70%",
    height: "400px",
    aspectRatio: "0.5",
  };

  const makeYTPlayer = (e: { target: YT.Player }) => {
    setYTPlayer(e.target);
  };

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
            Youtube動画を検索して、秒数毎にメモしながら視聴できます。
          </Typography>

          <Typography fontSize="1.5rem" fontWeight="500">
            動画をクリックして、このアプリの使い方を見てみましょう💡
          </Typography>

          <Box
            height="28rem"
            sx={{
              width: "100%",
              border: 1,
            }}
          >
            <YouTube videoId="zQnBQ4tB3ZA" opts={opts} onReady={makeYTPlayer} />
          </Box>

          <Link href="/signup">
            <MainButton>初めての方はこちら</MainButton>
          </Link>

          <Link href="/signin">
            <MainButton sx={{ width: "9rem" }}>ログイン</MainButton>
          </Link>
        </Stack>
      </Box>
    </>
  );
}
