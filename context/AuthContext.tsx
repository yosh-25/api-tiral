import React, { useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../src/lib/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { AuthContextType } from "../src/types";

// コンテキストを作成
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  // useContextで作成したコンテキストを呼び出す
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 第2引数に[]を指定して、初回レンダリングのみ関数を実行させる
  useEffect(() => {
    // onAuthStateChangedでログインの状態を監視する
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // ユーザー情報をcurrentUserに格納する
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
  };

  // _app.jsで全コンポーネントをラッピングするためのプロバイダー
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
