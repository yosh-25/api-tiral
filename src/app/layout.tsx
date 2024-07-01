"use client";
import Head from "next/head";
import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import { AuthProvider } from "../../context/AuthContext";
import { RecoilRoot } from "recoil";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "@/app/components/Header";
import { Box } from "@mui/material";
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
}>) {
  const pathname = usePathname();
  const pathsWithNoHeader = ["/signin", "/signup", "/"];

  const isNoHeaderPage = pathsWithNoHeader.includes(pathname);

  const title = metadata.title ? String(metadata.title) : "";
  const description = metadata.description ? String(metadata.description) : "";

  return (
    <html lang="ja">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <body>
        <AuthProvider>
          <RecoilRoot>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {isNoHeaderPage ? null : <Header />}

              <Box
                sx={{
                  marginTop: "10em",
                  marginRight: "auto",
                  marginLeft: "auto",
                  width: {
                    xs: "100%",
                    md: "70%",
                  },
                  minHeight: "100vh",
                }}
              >
                {children}
              </Box>
              <Footer />
            </ThemeProvider>
          </RecoilRoot>
        </AuthProvider>
      </body>
    </html>
  );
}
