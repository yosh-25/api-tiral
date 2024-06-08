import { Box } from '@mui/material';
import { useAuth } from '../../../context/AuthContext'
import { getAuth, signOut } from "firebase/auth";
import ButtonToAddMemo from './elements/buttons/buttonToAddMemo';
import MainButton from './elements/buttons/mainButton';

const Header = () => {
  const { currentUser }:any = useAuth();
  // console.log(currentUser);

  return (
    <Box style={{ padding: "1rem 0" }} >
      { currentUser ? (
        // useAuth()で取得した現在ログインしているユーザーのメールアドレスをcurrentUser.emailで表示
        <Box suppressHydrationWarning={true}>
          <MainButton style={{ paddingBottom: "1rem" }}>ログアウト </MainButton>
        </Box>
      ):(
        <div suppressHydrationWarning={true}>会員登録/ログインはこちら</div>
      )}
    </Box>
  );
}

export default Header;