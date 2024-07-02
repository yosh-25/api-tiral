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

export default function Home() {
  const router = useRouter();
  const [YTPlayer, setYTPlayer] = useState<YT.Player>();
  const { currentUser } = useAuth();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLg = useMediaQuery(theme.breakpoints.up('md'));

  // 前回ログインしたままの場合メインページへ遷移
  useEffect(() => {
    if (currentUser) router.replace("/mypage");
  }, [currentUser]);

  const getYouTubeOpts = () => {
    if (isXs) {
      return { width: '375px', height: '220px' };
    } else if (isMd) {
      return { width: '800px', height: '450px' };
    } else if (isLg) {
      return { width: '1100px', height: '620px' };
    } else {
      return { width: '100%', height: 'auto' };
    }
  };

  const opts = getYouTubeOpts();

  const makeYTPlayer = (e: { target: YT.Player }) => {
    setYTPlayer(e.target);
  };

  return (
    <html lang="ja">
    <Head>
      <title>サインイン - Memotube</title>
      <meta name="description" content="Memotubeへのサインインページです。" />
    </Head>
    <body>
      <ThemeProvider theme={theme}>
        <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          marginTop: '4em'
        }}
      >
        <Stack alignItems="center" gap="2rem">
          
          <Typography variant="h1" fontSize="3rem" textAlign='center' fontWeight="750">
            Memotube
          </Typography>

          <Box width='70%'>
          <Typography variant="h2" fontWeight="500" mb='1em' sx={{fontSize:{xs:'1.3em', md:"2em"}}} >
            Youtube動画を検索して、<br/>視聴しながら好きな箇所でメモが取れます。
          </Typography>

          <Typography fontWeight="500" sx={{fontSize:{xs:'1.3em', md:"2em"}}}>
            動画をクリックして、このアプリの使い方を見てみましょう💡
          </Typography>
          </Box>
          
          <YouTube videoId="CtMVk75abXg" opts={opts} onReady={makeYTPlayer} />

          <Link href="/signup">
            <MainButton>初めての方はこちら</MainButton>
          </Link>

          <Link href="/signin">
            <MainButton sx={{ width: "9rem" }}>ログイン</MainButton>
          </Link>
        </Stack>
      </Box>
      </ThemeProvider>
      </body>
    </html>
  );
}
