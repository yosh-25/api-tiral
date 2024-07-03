"use client";
import { useRouter } from "next/navigation";
import { Stack, Typography, Box, useMediaQuery } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import Link from "next/link";
import MainButton from "./components/elements/buttons/mainButton";
import { useAuth } from "../../context/AuthContext";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";
import Head from "next/head";
import Footer from "./components/Footer";

export default function Home() {
  const router = useRouter();
  const [YTPlayer, setYTPlayer] = useState<YT.Player>();
  const { currentUser } = useAuth();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLg = useMediaQuery(theme.breakpoints.up("md"));

  // 前回ログインしたままの場合メインページへ遷移
  useEffect(() => {
    if (currentUser) router.replace("/mypage");
  }, [currentUser]);

  const getYouTubeOpts = () => {
    if (isXs) {
      return { width: "375px", height: "220px" };
    } else if (isMd) {
      return { width: "800px", height: "450px" };
    } else if (isLg) {
      return { width: "1000px", height: "600px" };
    } else {
      return { width: "100%", height: "auto" };
    }
  };

  const opts = getYouTubeOpts();

  const makeYTPlayer = (e: { target: YT.Player }) => {
    setYTPlayer(e.target);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        minHeight: "100vh",
      }}
    >
      <Stack alignItems="center" gap="2rem" mb= "3em">
        <Typography
          variant="h1"
          fontSize="3rem"
          textAlign="center"
          fontWeight="750"
          sx={{
            fontSize:{
              xs: '2em',
              md: '3em'
            }
          }}
          
        >
          Memotubeへようこそ
        </Typography>

        <Box width="70%">
          <Typography
            variant="h2"
            fontWeight="500"
            mb="1em"
            sx={{ fontSize: { xs: "1.3em", md: "1.8em" } }}
          >
            Youtube動画を検索して、
            <br />
            視聴しながら好きな箇所でメモが取れます。
          </Typography>

          <Typography
            fontWeight="500"
            sx={{ fontSize: { xs: "1.3em", md: "1.8em" } }}
          >
            動画をクリックして、
            <br />
            このアプリの使い方を見てみましょう💡
          </Typography>
        </Box>

        <YouTube videoId="GOebZ7Lh9z8" opts={opts} onReady={makeYTPlayer} />

        <Link href="/signup">
          <MainButton>初めての方はこちら</MainButton>
        </Link>
        <Link href="/signin">
          <MainButton sx={{ width: "9rem" }}>ログイン</MainButton>
        </Link>
      </Stack>
    </Box>
  );
}
