import {
  AppBar,
  Box,
  IconButton,
  Menu,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../../../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import ButtonToAddMemo from "./elements/buttons/buttonToAddMemo";
import MainButton from "./elements/buttons/mainButton";
import SigninOrOut from "./SigninOrOut";
import SearchBar from "./elements/searchBar";
import Search from "./Search";
import Link from "next/link";

const Header = () => {
  const { currentUser }: any = useAuth();
  // console.log(currentUser);

  return (
    <>
      <AppBar color="default" position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" sx={{ ml: 5 }}>
            <Typography fontWeight="750">Memotube</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                ml: 8,
              }}
            >
              <Link href={'/mypage'}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2}}
              >
                <HomeIcon />
              </IconButton>
              </Link>
              <Link href={'/searchResults'}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2}}
              >
                <SearchIcon />
              </IconButton>
              </Link>
            </Box>
          </Box>
          {/* <Box sx={{width: '40%'}}>
          <Search/>
          </Box> */}
          <Box style={{ padding: "1rem 0" }}>
            <SigninOrOut />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
