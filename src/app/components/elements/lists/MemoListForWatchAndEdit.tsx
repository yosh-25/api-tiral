import React, { useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField } from '@mui/material';
import { MemoList as MemoListType, Memo } from '@/types';

interface MemoListProps {
  memoList: MemoListType;
  videoId: string;
  convertToSeconds: (time: string) => number;
  onDelete: (id: string) => void;
  onEdit: (memo: Memo) => void;
  onUpdate: (id: string, e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => void;
  toggleEditMode: (id: string) => void;
}

const MemoListForWatchAndEdit: React.FC<MemoListProps> = ({
  memoList,
  videoId,
  convertToSeconds,
  onDelete,
  onUpdate,
  onEdit,
  toggleEditMode,
}) => {
  // 編集前のメモ内容を保存するための状態
  const [originalMemoContent, setOriginalMemoContent] = useState<{ [key: string]: string }>({});

  const handleEditToggle = (memo: Memo) => {
    if (!memo.isEditing) {      
      // 編集モードに入るときに、元の内容を保存する
      setOriginalMemoContent((prev) => ({ ...prev, [memo.id]: memo.content }));
    } else {
      // 編集モードをキャンセルする時に元の内容に戻す
      onUpdate(memo.id, { target: { value: originalMemoContent[memo.id] } } as React.ChangeEvent<HTMLInputElement>);
    }
    toggleEditMode(memo.id);
  };

  const handleSave = (memo: Memo) => {
    // 内容が空または空白のみの場合、保存を無効にする
    if (!memo.content || memo.content.trim() === '') {
      console.log("メモ内容が空です。保存されませんでした。");
      return;
    }
    onEdit(memo);
    toggleEditMode(memo.id);
  };

  

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="20%">再生位置</TableCell>
            <TableCell align="left">メモ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {memoList
            ?.filter((memo) => memo.videoId === videoId)
            .sort((a, b) => convertToSeconds(a.createdAt) - convertToSeconds(b.createdAt))
            .map((memo) => (
              <TableRow key={memo.id}>
                <TableCell>{memo.createdAt}</TableCell>
                <TableCell>
                  {!memo.isEditing ? (
                    <>
                      <TableCell>{memo.content}</TableCell>
                      <TableCell>
                        <Button variant="outlined" onClick={() => handleEditToggle(memo)}>
                          編集
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TextField
                        value={memo.content}
                        onChange={(e) => onUpdate(memo.id, e)}
                        size="small"
                      />
                      <Button
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={() => handleSave(memo)}
                      >
                        保存
                      </Button>
                      <Button
                        sx={{ ml: 1 }}
                        onClick={() => handleEditToggle(memo)}
                      >
                        キャンセル
                      </Button>
                    </>
                  )}
                </TableCell>
                <TableCell>
                  <Button onClick={() => onDelete(memo.id)}>削除</Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MemoListForWatchAndEdit;
