import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export const metadata: Metadata = {
  title: "Memotube",
  description:
    "Youtubeで気になったシーンに対してメモが作成でき、後で見直しができるアプリです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        
        <AppBar color='default' position="static" >
          <Toolbar  sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Box display='flex' alignItems='center'>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>   
            <Typography fontWeight='750'>Memotube</Typography>         
            </Box>
            <Button color="inherit" >会員登録/ログインはこちら</Button>
          </Toolbar>
        </AppBar>
       
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "50px",
            marginRight: 'auto',
            marginLeft: 'auto',
            width: '70%'
          }}
        >
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        </Box>
      </body>
    </html>
  );
}
