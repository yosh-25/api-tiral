'use client'
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../../libs/firebase";
import React, { useEffect, useState } from "react";

const Header = () => {
  // 現在ログインしているユーザーを取得する
  const [currentUser, setCurrentUser] = useState<User|null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ユーザーがログインしている場合
        setCurrentUser(user);
        console.log(currentUser);
      } else {
        // ユーザーがログアウトしている場合
        setCurrentUser(null);
      }
    });

    // クリーンアップ関数を返す
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "1rem 0" }} >
      { currentUser ? (
        // suppressHydrationWarningを入れてサーバーサイドとクライアントサイドでレンダーされる内容が違うときにエラーがでないようにする
        <div suppressHydrationWarning={true}>
          <div style={{ paddingBottom: "1rem" }}>※ここにログインしているユーザーのメールアドレス※ でログインしています。</div>
        </div>
      ):(
        <div suppressHydrationWarning={true}>ログインしていません。</div>
      )}
    </div>
  );
}

export default Header;