"use client";

import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { AuthProvider } from "../../context/AuthContext";
// import RecoilProvider from './recoilProvider'
import { RecoilRoot } from "recoil";
import dynamic from "next/dynamic";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from '@/app/components/Header';

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const metadata: Metadata = {
  title: "Memotube",
  description:
    "Youtubeで気になったシーンに対してメモが作成でき、後で見直しができるアプリです。",
};

const theme = createTheme();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)

{
  
  return (
    <AuthProvider>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <html lang="en">
            <body>
              <AppBar color="default" position="static">
                <Toolbar
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Box display="flex" alignItems="center">
                    <IconButton
                      size="large"
                      edge="start"
                      color="inherit"
                      aria-label="menu"
                      sx={{ mr: 2 }}
                    >
                      <MenuIcon />
                    </IconButton>
                    <Typography fontWeight="750">Memotube</Typography>
                  </Box>
                  <Header/>
                </Toolbar>
              </AppBar>
              <Box
                sx={{
                  marginTop: "50px",
                  marginRight: "auto",
                  marginLeft: "auto",
                  width: "70%",
                }}
              >
                {children}
              </Box>
            </body>
          </html>
        </ThemeProvider>
      </RecoilRoot>
    </AuthProvider>
  );
}
