"use client";
import { useRouter } from "next/navigation";
import { Typography, Box, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import YouTube from "react-youtube";
import Link from "next/link";
import MainButton from "./components/elements/buttons/mainButton";
import { useAuth } from "@/context/AuthContext";
import theme from "@/theme";

export default function Home() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLarge = useMediaQuery(theme.breakpoints.between("md", "lg"));

  // 前回ログインしたままの場合メインページへ遷移
  useEffect(() => {
    if (currentUser) router.replace("/mypage");
  }, [currentUser]);

  // 動画の画面サイズを動的に設定
  const getYouTubeOpts = () => {
    if (isSmall) {
      return { width: "375px", height: "220px" };
    }
    if (isMedium) {
      return { width: "550px", height: "310px" };
    }
    if (isLarge) {
      return { width: "800px", height: "450px" };
    }
    return { width: "1000px", height: "560px" };
  };

  const opts = getYouTubeOpts();

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
      <Typography
        variant="h1"
        sx={{
          fontWeight: 700,
          fontSize: {
            xs: "2rem",
            md: "3rem",
          },
          mb: "30px",
        }}
      >
        Memotubeへようこそ
      </Typography>

      <Box width="70%">
        <Typography
          variant="h2"
          sx={{
            fontWeight: 500,
            fontSize: { xs: "1.3rem", md: "1.8rem" },
            mb: "25px",
          }}
        >
          Youtube動画を検索して、
          <br />
          視聴しながら好きな箇所でメモが取れます。
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 500,
            fontSize: { xs: "1.3rem", md: "1.8rem" },
            mb: "25px",
          }}
        >
          動画をクリックして、
          <br />
          このアプリの使い方を見てみましょう💡
        </Typography>
      </Box>

      <YouTube videoId="GOebZ7Lh9z8" opts={opts} />

      <Box sx={{ width: "100%" }}>
        <Box sx={{ mt: "40px" }}>
          <Link href="/signup">
            <MainButton sx={{ width: { xs: "70%", sm: "30%" } }}>
              初めての方はこちら
            </MainButton>
          </Link>
        </Box>
        <Box sx={{ mt: "40px", mb: "40px" }}>
          <Link href="/signin">
            <MainButton sx={{ width: { xs: "70%", sm: "30%" } }}>
              ログイン
            </MainButton>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
