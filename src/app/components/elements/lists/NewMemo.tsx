import React from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { Memo } from "@/types/index";

interface MemoFormProps {
  timeToShow: string;
  newMemo: Memo;
  editNewMemo: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const NewMemo: React.FC<MemoFormProps> = ({
  timeToShow,
  newMemo,
  editNewMemo,
  onSave,
  onCancel,
}) => {
  return (
    <Box sx={{ width: { xs: "90%", sm: "70%" } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: "8px",
          py: { xs: "5px", sm: "9px" },
          pl: "32px",
          ml: { xs: "16px", md: "0px" },
          border: 1,
          fontSize: "1rem",
        }}
      >
        <Typography
          sx={{
            mr: "1rem",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          {timeToShow}
        </Typography>
        <TextField
          variant="standard"
          placeholder="ここにメモを記入"
          value={newMemo.content}
          onChange={editNewMemo}
          InputProps={{
            disableUnderline: true,
          }}
          sx={{ width: "100%" }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: "16px",
        }}
      >
        <Box sx={{ mr: "1rem" }}>
          <Button sx={{ border: 1, width: "100%" }} onClick={onCancel}>
            キャンセル
          </Button>
        </Box>
        <Box>
          <Button sx={{ border: 1, width: "100%" }} onClick={onSave}>
            保存する
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NewMemo;
