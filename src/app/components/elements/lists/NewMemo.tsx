import React from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { Memo } from '@/types';

interface MemoFormProps {
  timeToShow: string;
  newMemo: Memo;
  editNewMemo: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const NewMemo: React.FC<MemoFormProps> = ({ timeToShow, newMemo, editNewMemo, onSave, onCancel }) => {
  return (
    <Box sx={{ width: "70%" }}>
      <Box display="flex" alignItems="center" paddingTop="0.5rem" paddingBottom="0.5rem" marginTop="0.5rem" sx={{ border: 1 }}>
        <Typography
          sx={{
            paddingBottom: "0.3rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            marginLeft: "1rem",
            fontWeight: "bold",
            fontSize: "1rem",
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
      <Box display="flex" justifyContent="flex-end" sx={{ mt: 0.8 }}>
        <Box marginRight="1rem">
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
