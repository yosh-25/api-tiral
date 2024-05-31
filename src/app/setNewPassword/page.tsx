'use client'

import { useEffect, useState } from "react";
import firebase from "firebase/app";
import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "../../../libs/firebase";

const NewPassword = () => {
  const [actionCode, setActionCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [oobCode, setOobCode] = useState<string>("");

  // 初回のレンダリングのみ
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const oobCode = queryParams.get("oobCode") || "";
    //   setMode(mode)
    setActionCode(oobCode);
  }, []);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (oobCode === "") return; // 取得できない場合処理終了

    verifyPasswordResetCode(auth, actionCode)
      .then(() => {
        confirmPasswordReset(auth, actionCode, password)
          .then(async (resp) => {
            console.log("success");
            // 成功。ログイン画面などを表示するコードを足す場所
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
  
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Reset Password</button>
    </form>
    
  );
};
export default NewPassword;
