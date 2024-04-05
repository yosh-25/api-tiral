import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";

export const metadata: Metadata = {
  title: "English Learning Made Easy",
  description:
    "このアプリを使って英語を読むことで、簡単に単語の意味や使い方を知ることができます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '80px'}}>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </Box>
      </body>
    </html>
  );
}
