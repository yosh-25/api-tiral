import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "@/context/AuthContext";
import SigninOrOut from "./SigninOrOut";
import Link from "next/link";
import { usePathname } from 'next/navigation';

const Header = () => {
  const { currentUser } = useAuth();
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
                xs: 2,
                md: 5,
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
                  xs: 4,
                  md: 8,
                },
              }}
            >
              {!pageWithoutHomeIcon.includes(currentPath) && (
              <Link href={"/mypage"}>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <HomeIcon />
                </IconButton>
              </Link>
              )}
              {!pageWithoutSearchIcon.includes(currentPath) && !isSearchResultsPage && (
                <Link href={"/search"}>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <SearchIcon />
                </IconButton>
              </Link>
              )}              
            </Box>
          </Box>
          <Box style={{ padding: "1rem 0" }}>
            <SigninOrOut />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
