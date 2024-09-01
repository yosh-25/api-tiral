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
import Link from "next/link";

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
  ytPlayer: YT.Player | undefined;
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
  ytPlayer,
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
    if (!memo.content || memo.content.trim() === "") return;
    onEdit(memo);
    toggleEditMode(memo.id);
  };

  // createdAtを秒数のみの表記に変換
  const convertTimeStringToSeconds = (timeString: string): number => {
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  // クリックしてメモの秒数から動画を再生する。
  const moveToTimestamp = (memo: Memo) => {
    const seconds = convertTimeStringToSeconds(memo.createdAt);
    ytPlayer?.seekTo(seconds, true);
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
                px: {
                  xs: "8px",
                  sm: "16px",
                },
              }}
            >
              時間
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
                pl: {
                  xs: "16px",
                  md: "16px",
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
                      xs: "0.85rem",
                      md: "1rem",
                    },
                    px: {
                      xs: "8px",
                      sm: "16px",
                    },
                    height: "72px",
                  }}
                >
                  <Link href="#" onClick={() => moveToTimestamp(memo)}>
                    {memo.createdAt}
                  </Link>
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
                        pl: {
                          xs: "20px",
                          md: "16px",
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
                          pl: "13px",
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
