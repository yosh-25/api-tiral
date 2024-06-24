import React from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Memo } from "@/types";
import MainButton from "../buttons/mainButton";
import Link from "next/link";

interface CustomCardsForMemoListProps {
  videoId: string;
  memos: Memo[];
}

const CustomCardsForMemoList: React.FC<CustomCardsForMemoListProps> = ({
  videoId,
  memos,
}) => {
  if (!memos || memos.length === 0) {
    return null;
  }

  return (
    <Box
      key={videoId}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "80%",
        mb: 5,
        // backgroundColor: "#e1f5fe",
        border: "0.5px solid lightgray",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column", // xsおよびそれ以下の幅で縦方向に
            sm: "row", // mdおよびそれ以上の幅で横方向に
          },
          justifyContent: {
            xs: "center",
            sm: "start",
          },
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={memos[0].videoThumbnail}
          alt="Thumbnail"
          sx={{
            width: {
              xs: "100%", // xsおよびそれ以下の幅で全幅に
              sm: "160px", // mdおよびそれ以上の幅で固定幅に
            },
            height: {
              xs: "auto", // 高さを自動で調整
              sm: "90px", // mdおよびそれ以上の幅で固定高さに
            },
            objectFit: "cover",
            marginBottom: "16px", // サムネイルとタイトルの間にマージンを追加
          }}
        />
        <Typography
          variant="h3"
          fontWeight="500"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2, // 行数の制限を指定
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "1.5em", // 行間の高さを設定
            height: { xs: "3em", md: "3em" },
            fontSize: { xs: "1.2em", md: "1.5em" },
            mr: { md: 2 },
            ml: { xs: "1em", md: "2em" },
          }}
        >
          {memos[0].videoTitle}
        </Typography>
      </Box>
      <TableContainer sx={{ mt: 2, overflowX: "auto" }}>
        <Table
          sx={{
            tableLayout: "fixed",
            width: "100%",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 
                {xs: '30%',
                  md: "33%",
                  lg:"23%"}, 
                
                fontSize: {xs:"0.6em", lg: '0.9em' }}}>
                再生位置
              </TableCell>
              <TableCell sx={{ fontSize: {xs:"0.6em", lg: '0.9em' } }}>メモ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {memos.map((memo, index) => (
              <TableRow key={index}>
                <TableCell sx={{ pl: 3 }}>
                  {memo.createdAt}
                </TableCell>
                <TableCell
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {memo.content}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* todo: リンク先後で編集 */}
      <Link href={"./watchAndEdit/" + videoId}>
        <MainButton sx={{ width: "100%" }}>
          この動画を見る/メモを編集する
        </MainButton>
      </Link>
    </Box>
  );
};

export default CustomCardsForMemoList;
