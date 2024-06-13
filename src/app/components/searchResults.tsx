"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useRecoilState } from "recoil";
import { videoDetails, searchedVideoData } from "@/app/states/videoDataState";
import { Data, Item, Memo } from "@/types";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Link,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIconAndFunction from "./SearchIconAndFunction";
import SearchBar from "./elements/searchBar";

const YOUTUBE_SEARCH_API_URI = "https://www.googleapis.com/youtube/v3/search";
const youtubeUrl = "https://www.youtube.com/watch?v=";
const channelUrl = "https://www.youtube.com/channel/";
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const formatDate = (publishedAt: string) => {
  const date = new Date(publishedAt);
  return date.toLocaleString("ja-JP");
};

const SearchResults = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchedResults, setSearchedResults] =
    useRecoilState(searchedVideoData);
  const [videoData, setVideoData] = useRecoilState(videoDetails);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageTokens, setPrevPageTokens] = useState<string[]>([]);

  const router = useRouter();
  const { currentUser }: any = useAuth();

  // エラーの原因！
  useEffect(() => {
    if (!currentUser) router.replace("/signin"); // ログインしていなければサインインページへ転
  }, [currentUser]);

  const fetchVideos = async (pageToken?: string) => {
    if (!API_KEY) {
      console.error("API_KEY is undefined");
      return;
    }

    let nextPageToken = null;
    let prevPageToken = [];

    //クエリ文字列を整理する
    const params = {
      key: API_KEY,
      part: "snippet",
      q: searchTerm, //検索ワード
      type: "video",
      maxResults: "50", //表示する動画数
      pageToken: pageToken || "", // 次50個の検索表示用
      order: "relevance", //デフォルトの並び順
    };
    const queryParams = new URLSearchParams(params);

    try {
      const response = await fetch(
        `${YOUTUBE_SEARCH_API_URI}?${queryParams.toString()}`
      );
      const result = await response.json();
      if (result.items) {
        setSearchedResults(result.items);
      }
      if (result.nextPageToken) {
        setNextPageToken(result.nextPageToken);
      }
      if (pageToken) {
        setPrevPageTokens((prevTokens) => [...prevTokens, pageToken]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(searchedResults);
  }, [searchedResults]);

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClick = () => {
    // 新しい検索の際にリセット
  };

  return (
    <Stack gap="3rem">
      <Box>
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          onClick={handleClick}
        />
        <SearchIconAndFunction />
      </Box>

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
            <Button
              variant="contained"
              onClick={handlePrevPage}
              disabled={prevPageTokens.length === 0}
            >
              前のページ
            </Button>
            <Button
              variant="contained"
              onClick={handleNextPage}
              disabled={!nextPageToken}
            >
              次のページ
            </Button>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default SearchResults;
