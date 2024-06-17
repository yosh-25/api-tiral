"use client";

import type { Metadata } from "next";
import { usePathname } from 'next/navigation'
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { AuthProvider } from "../../context/AuthContext";
// import RecoilProvider from './recoilProvider'
import { RecoilRoot } from "recoil";
import dynamic from "next/dynamic";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "@/app/components/Header";

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Footer from "./components/Footer";

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
  const pathname = usePathname();
  const pathsWithNoHeader = ['/signin','/signup', '/']

  const isNoHeaderPage = pathsWithNoHeader.includes(pathname);


  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <RecoilRoot>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {isNoHeaderPage? (null):(<Header/>)}
     
              <Box
                sx={{
                  marginTop: "120px",
                  marginRight: "auto",
                  marginLeft: "auto",
                  width: {
                    xs: "100%",
                    md: "70%"},
                  minHeight: "100vh"
                }}
              >
                {children}  
              </Box>
              <Footer/>             
              
             
            </ThemeProvider>
          </RecoilRoot>
        </AuthProvider>
      </body>
    </html>
  );
}
