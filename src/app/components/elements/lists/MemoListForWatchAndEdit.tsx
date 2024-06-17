import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Box } from '@mui/material';
import { MemoList as MemoListType, Memo } from '@/types';

interface MemoListProps {
  memoList: MemoListType;
  videoId: string;
  videoTitle: string;
  convertToSeconds: (time: string) => number;
  onDelete: (id: string) => void;
  onEdit: (memo: Memo) => void;
  onUpdate: (id: string, content: string) => void;
  toggleEditMode: (id: string) => void;
}

const MemoListForWatchAndEdit: React.FC<MemoListProps> = ({
  memoList,
  videoId,
  videoTitle,
  convertToSeconds,
  onDelete,
  onEdit,
  onUpdate,
  toggleEditMode,
}) => {
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
            .map((memo, id) => (
              <TableRow key={id}>
                <TableCell>{memo.createdAt}</TableCell>
                <TableCell>
                  {!memo.isEditing ? (
                    <>
                      <TableCell >{memo.content}</TableCell>
                      <TableCell>
                        <Button variant="outlined" onClick={() => toggleEditMode(memo.id)}>
                          編集
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TextField
                        value={memo.content}
                        onChange={(e) => onUpdate(memo.id, e.target.value)}
                        size="small"
                      />
                      <Button variant="contained" sx={{ ml: 1 }} onClick={() => onEdit(memo)}>
                        保存
                      </Button>
                      <Button sx={{ ml: 1 }} onClick={() => toggleEditMode(memo.id)}>
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
