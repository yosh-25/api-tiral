// AuthContext.jsのuseAuthをインポートする
import { useAuth } from '../../../context/AuthContext'
import { getAuth, signOut } from "firebase/auth";


const Header = () => {
  const { currentUser }:any = useAuth();
  // console.log(currentUser);

  return (
    <div style={{ padding: "1rem 0" }} >
      { currentUser ? (
        // useAuth()で取得した現在ログインしているユーザーのメールアドレスをcurrentUser.emailで表示
        <div suppressHydrationWarning={true}>
          <div style={{ paddingBottom: "1rem" }}>{ currentUser.email } </div>
        </div>
      ):(
        <div suppressHydrationWarning={true}>会員登録/ログインはこちら</div>
      )}
    </div>
  );
}

export default Header;