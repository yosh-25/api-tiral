"use client";
import React from 'react'
import { useRouter } from "next/navigation";
import { Button, Stack, TextField, Typography } from "@mui/material";

const learn = () => {
  return (
    <div>
        <Button>検索
            <input type='text' placeholder='検索ワードを入力'/>
        </Button>
    </div>
  )
}

export default learn
