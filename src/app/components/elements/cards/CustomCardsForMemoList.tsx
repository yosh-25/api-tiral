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
import { Memo } from "@/types/index";
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

  const sortedMemos = memos.sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  );

  return (
    <Box
      key={videoId}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: { xs: "100%", sm: "80%" },
        mb: "40px",
        border: "0.5px solid lightgray",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
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
              xs: "100%",
              sm: "240px",
            },
            height: {
              xs: "auto",
              sm: "140px",
            },
            objectFit: "cover",
            mb: "16px",
          }}
        />
        <Typography
          variant="h3"
          fontWeight="500"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "1.5em",
            height: { xs: "3em", md: "3em" },
            fontSize: { xs: "1.2rem", md: "1.5rem" },
            mx: { xs: "1em", md: "2em" },
          }}
        >
          {memos[0].videoTitle}
        </Typography>
      </Box>
      <TableContainer sx={{ mt: "16px", mb: "10px", overflowX: "auto" }}>
        <Table
          sx={{
            tableLayout: "fixed",
            width: "100%",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  width: { xs: "30%", md: "33%", lg: "23%" },
                  fontSize: { xs: "0.8rem", md: "0.9rem" },
                }}
              >
                再生位置
              </TableCell>
              <TableCell sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                メモ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedMemos.map((memo, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" }, pl: "24px" }}
                >
                  {memo.createdAt}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: "0.8rem", md: "0.9rem" },
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
      <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", mb:"10px"}}>
      <Link href={"./watchAndEdit/" + videoId}>
        <MainButton sx={{ width: "270px", p: "8px", lineHeight: "20px" }}>
          この動画を見る/<br/>メモを編集する
        </MainButton>
      </Link>
      </Box>
    </Box>
  );
};

export default CustomCardsForMemoList;
