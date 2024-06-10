import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useState } from "react";
import Link from "next/link";
import MainButton from "../buttons/mainButton";
import { useRecoilState } from "recoil";
import { videoDetails, searchedVideoData } from "@/app/states/videoDataState";
import { Item, Memo } from "@/types";
import { useAuth } from "../../../../../context/AuthContext";

const ListofSearchedResults = () => {
  const [searchedResults, setSearchedResults] =
    useRecoilState(searchedVideoData);
  const [videoData, setVideoData] = useRecoilState(videoDetails);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageTokens, setPrevPageTokens] = useState<string[]>([]);
  const { currentUser }: any = useAuth();

  const formatDate = (publishedAt: string) => {
    const date = new Date(publishedAt);
    return date.toLocaleString("ja-JP");
  };

  const SaveVideoDetails = (item: Item) => {
    const videoData: Memo = {
      id: "",
      videoId: item.id.videoId,
      videoThumbnail: item.snippet.thumbnails?.medium.url,
      videoTitle: item.snippet.title,
      createdTime: "",
      createdAt: "",
      content: "",
      uid: currentUser.uid,
    };
    setVideoData(videoData);
    console.log(videoData);
  };

  const handleNextPage = async () => {
    if (nextPageToken) {
      await fetchVideos(nextPageToken);
      window.scroll({
        top: 0,
        behavior: "instant",
      });
    }
  };

  const handlePrevPage = () => {
    if (prevPageTokens.length > 0) {
      const lastPageToken = prevPageTokens.pop();
      fetchVideos(lastPageToken);
    }
  };
  return (
    <Box>
      <Box height="15rem" sx={{ width: "100%" }}>
        {Array.isArray(searchedResults) && searchedResults.length > 0 ? (
          searchedResults?.map((item: Item, index: number) => (
            <>
              <Typography>検索結果</Typography>
              <Box className="item" key={index}>
                <Link
                  href={"searchResults/" + item.id.videoId + "/watchAndEdit"}
                  onClick={() => SaveVideoDetails(item)}
                >
                  <Box className="thumbnail">
                    <img
                      src={item.snippet?.thumbnails?.medium?.url}
                      alt={item.snippet?.title}
                    />
                  </Box>
                  <Box className="right">
                    <Box className="title">
                      <Typography>{item.snippet?.title}</Typography>
                    </Box>
                    <Box className="description">
                      {item.snippet?.description}
                    </Box>
                    <Box className="channel">
                      <Typography>{item.snippet?.channelTitle}</Typography>
                    </Box>
                    <Box className="time">
                      {formatDate(item.snippet?.publishedAt)}
                    </Box>
                  </Box>
                </Link>
              </Box>
            </>
          ))
        ) : (
          <Typography>検索するとここに結果がでます</Typography>
        )}
        <Box>
          <MainButton
            onClick={handlePrevPage}
            disabled={prevPageTokens.length === 0}
          >
            前のページ
          </MainButton>
          <MainButton
            variant="contained"
            onClick={handleNextPage}
            disabled={!nextPageToken}
          >
            次のページ
          </MainButton>
        </Box>
      </Box>
    </Box>
  );
};
export default ListofSearchedResults;
