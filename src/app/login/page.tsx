'use client'
import React from 'react'
import { useRouter } from "next/navigation";
import { Button, Stack, TextField, Typography } from "@mui/material";

const login = () => {

  const router = useRouter();

  return (
    <Stack height="100vh" justifyContent="center" alignItems="center" gap="32px">
      <Typography id="login_heading" variant="h1" fontSize="1.5rem">ログインフォーム</Typography>
      <Stack component="form" width={560} gap="24px" aria-labelledby="login_heading">
        <TextField label="メールアドレス" />
        <TextField label="パスワード" />
        <Button variant="contained" onClick={()=> router.push('/learn')}>ログイン</Button>
      </Stack>
    </Stack>
  )
}

export default login
