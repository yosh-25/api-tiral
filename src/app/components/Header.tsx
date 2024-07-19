import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AuthAction from "./AuthAction";
import Link from "next/link";
import { usePathname } from 'next/navigation';

const Header = () => {

  // ページ別でヘッダー内容を微調整する定数
  const pageWithoutSearchIcon = ['/','/mypage', '/search', '/search/results'];
  const pageWithoutHomeIcon = ['/'];
  const currentPath = usePathname();
  const isSearchResultsPage = currentPath.startsWith('/search/results');

  return (
    <>
      <AppBar color="default">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            display="flex"
            alignItems="center"
            sx={{
              ml: {
                xs: "16px",
                md: "40px",
              },
            }}
          >
            <Typography fontWeight="750">Memotube</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                ml: {
                  xs: "32px",
                  md: "64px",
                },
              }}
            >
              {/* '/'ではhomeアイコンを非表示 */}
              {!pageWithoutHomeIcon.includes(currentPath) && (
              <Link href={"/mypage"}>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: "16px" }}
                >
                  <HomeIcon />
                </IconButton>
              </Link>
              )}
              {/* '/mypage', '/search', '/search/results'では検索アイコン非表示 */}
              {!pageWithoutSearchIcon.includes(currentPath) && !isSearchResultsPage && (
                <Link href={"/search"}>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: "16px" }}
                >
                  <SearchIcon />
                </IconButton>
              </Link>
              )}              
            </Box>
          </Box>
          <Box style={{ padding: "16px 0" }}>
            <AuthAction />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;