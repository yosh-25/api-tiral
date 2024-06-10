import React, { useState, useEffect } from "react";
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
import InputAdornment from "@mui/material/InputAdornment";
import SearchBar from "./elements/searchBar";
import VideoFetcher from "./FetchVideos";

const YOUTUBE_SEARCH_API_URI = "https://www.googleapis.com/youtube/v3/search";
const youtubeUrl = "https://www.youtube.com/watch?v=";
const channelUrl = "https://www.youtube.com/channel/";
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchedResults, setSearchedResults] =
    useRecoilState(searchedVideoData);
  const [videoData, setVideoData] = useRecoilState(videoDetails);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageTokens, setPrevPageTokens] = useState<string[]>([]);
  const { currentUser }: any = useAuth();

  if (!API_KEY) {
    console.error("API_KEY is undefined");
    return;
  }

  const formatDate = (publishedAt: string) => {
    const date = new Date(publishedAt);
    return date.toLocaleString("ja-JP");
  };

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
        console.log(searchedResults)
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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setPrevPageTokens([]);
    fetchVideos();
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

  return (
    <SearchBar
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onClick={() => handleClick}
    />
  );
};

export default Search;
