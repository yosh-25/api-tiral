import React from "react";
import {
  Box,
  Typography,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import MainButton from "@/app/components/elements/buttons/mainButton";
import { MemosByVideoId } from "@/types/index";
import Image from "next/image";

interface Props {
  memoListByVideoId: MemosByVideoId;
  sortedVideoIds: string[];
}

const RecentMemos: React.FC<Props> = ({
  memoListByVideoId,
  sortedVideoIds,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        gap: 3,
      }}
    >
      {sortedVideoIds.slice(0, 3).map((videoId) => {
        const memos = memoListByVideoId[videoId] || [];
        const sortedMemos = memos.sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt)
        );
        const memosToShow = sortedMemos.slice(0, 2);

        return (
          <Box
            key={videoId}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: {
                xs: "100%",
                md: "45%",
                lg: "30%",
              },
              mb: 2,
              border: "1px solid #ccc",
              padding: 2,
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "1.5em",
                height: "3em",
                mb: 1,
              }}
            >
              {memosToShow[0]?.videoTitle}
            </Typography>
            <Link href={"watchAndEdit/" + memosToShow[0]?.videoId}>
              {memosToShow[0]?.videoThumbnail && (
                <img
                  src={memosToShow[0]?.videoThumbnail}
                  alt="Thumbnail"
                  style={{ width: "100%", borderRadius: "4px" }}
                />
              )}
            </Link>
            <TableContainer
              sx={{
                marginBottom: "10px",
                height: {
                  lg: "8em",
                },
              }}
            >
              <Table
                sx={{
                  tableLayout: "fixed",
                  width: "100%",
                }}
              >
                <TableBody>
                  {memosToShow.map((memo, uid) => (
                    <TableRow key={uid}>
                      <TableCell sx={{ width: "25%" }}>
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Link href={"watchAndEdit/" + memosToShow[0]?.videoId}>
                <MainButton>メモを編集/動画を視聴</MainButton>
              </Link>
            </Box>
            <Typography variant="body2" sx={{ textAlign: "right", mt: 2 }}>
              {memos.length >= 2 ? "2" : "1"}/{memos.length}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default RecentMemos;
