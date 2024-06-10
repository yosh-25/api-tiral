import {
  AppBar,
  Box,
  IconButton,
  Menu,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import ButtonToAddMemo from "./elements/buttons/buttonToAddMemo";
import MainButton from "./elements/buttons/mainButton";
import SigninOrOut from "./SigninOrOut";
import SearchBar from "./elements/searchBar";
import Search from "./Search";

const Header = () => {
  const { currentUser }: any = useAuth();
  // console.log(currentUser);

  return (
    <>
      <AppBar color="default" position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
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
          <Box sx={{width: '40%'}}>
          <Search/>
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
