import { Box } from '@mui/material';
import { useAuth } from '../../../context/AuthContext'
import { getAuth, signOut } from "firebase/auth";
import ButtonToAddMemo from './elements/buttons/buttonToAddMemo';
import MainButton from './elements/buttons/mainButton';
import Signout from './SignoutOrLinkToLogin';

const Header = () => {
  const { currentUser }:any = useAuth();
  // console.log(currentUser);

  return (
    <Box style={{ padding: "1rem 0" }} >
      <Signout/>
    </Box>
  );
}

export default Header;