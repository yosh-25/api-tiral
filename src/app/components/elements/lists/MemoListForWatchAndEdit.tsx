import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";
import { MemoList as MemoListType, Memo } from "@/types/index";
import ButtonForMemoEditing from "@/app/components/elements/buttons/ButtonForMemoEditing";

interface MemoListProps {
  memoList: MemoListType;
  videoId: string;
  convertToSeconds: (time: string) => number;
  onDelete: (id: string) => void;
  onEdit: (memo: Memo) => void;
  onUpdate: (
    id: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  toggleEditMode: (id: string) => void;
  editingMemoId: string | null;
}

const MemoListForWatchAndEdit: React.FC<MemoListProps> = ({
  memoList,
  videoId,
  convertToSeconds,
  onDelete,
  onUpdate,
  onEdit,
  toggleEditMode,
  editingMemoId,
}) => {
  // 編集前のメモ内容を保存するための状態
  const [originalMemoContent, setOriginalMemoContent] = useState<{
    [key: string]: string;
  }>({});

  const handleEditToggle = (memo: Memo) => {
    if (editingMemoId !== memo.id) {
      // 編集モードに入るときに、元の内容を保存する
      setOriginalMemoContent((prev) => ({ ...prev, [memo.id]: memo.content }));
    } else {
      // 編集モードをキャンセルする時に元の内容に戻す
      onUpdate(memo.id, {
        target: { value: originalMemoContent[memo.id] },
      } as React.ChangeEvent<HTMLInputElement>);
    }
    toggleEditMode(memo.id);
  };

  const handleSave = (memo: Memo) => {
    // 内容が空または空白のみの場合、保存を無効にする
    if (!memo.content || memo.content.trim() === "") {
      console.log("メモ内容が空です。保存されませんでした。");
      return;
    }
    onEdit(memo);
    toggleEditMode(memo.id);
  };

  return (
    <TableContainer sx={{ mb: { lg: "4em" } }}>
      <Table sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                width: {
                  xs: "4%",
                  md: "10%",
                },
                fontSize: {
                  xs: "0.7rem",
                  md: "1rem",
                },
              }}
            >
              再生位置
            </TableCell>
            <TableCell
              sx={{
                fontSize: {
                  xs: "0.7rem",
                  md: "1rem",
                },
                width: {
                  xs: "15%",
                  md: "19%",
                },
              }}
              align="left"
            >
              メモ
            </TableCell>
            <TableCell
              sx={{
                width: {
                  xs: "6%",
                  md: "5%",
                },
              }}
            ></TableCell>
            <TableCell
              sx={{
                width: {
                  xs: "6%",
                  md: "5%",
                },
              }}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {memoList
            ?.filter((memo) => memo.videoId === videoId)
            .sort(
              (a, b) =>
                convertToSeconds(a.createdAt) - convertToSeconds(b.createdAt)
            )
            .map((memo) => (
              <TableRow key={memo.id}>
                <TableCell
                  sx={{
                    fontSize: {
                      xs: "0.9rem",
                      md: "1rem",
                    },
                    height: "72px",
                  }}
                >
                  {memo.createdAt}
                </TableCell>
                {editingMemoId !== memo.id ? (
                  <>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: {
                          xs: "1rem",
                          md: "1rem",
                        },
                      }}
                    >
                      {memo.content}
                    </TableCell>
                    <TableCell sx={{ p: "0px" }}>
                      <ButtonForMemoEditing
                        label="編集"
                        onClick={() => handleEditToggle(memo)}
                      />
                    </TableCell>
                    <TableCell sx={{ p: "0px" }}>
                      <ButtonForMemoEditing
                        onClick={() => onDelete(memo.id)}
                        label="削除"
                      />
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell sx={{ p: 0 }}>
                      <TextField
                        value={memo.content}
                        onChange={(e) => onUpdate(memo.id, e)}
                        size="small"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: {
                            xs: "0.7rem",
                            md: "1rem",
                          },
                          width: "95%",
                          height: "100%",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ p: "0px" }}>
                      <ButtonForMemoEditing
                        label="保存"
                        onClick={() => handleSave(memo)}
                      />
                    </TableCell>
                    <TableCell sx={{ p: "0px" }}>
                      <ButtonForMemoEditing
                        label="取消"
                        onClick={() => handleEditToggle(memo)}
                      />
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default MemoListForWatchAndEdit;
