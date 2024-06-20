"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";
import { useRecoilState } from "recoil";
import { videoDetails, searchedVideoData } from "@/app/states/videoDataState";
import { Item, Memo } from "@/types";
import {
  Button,
  Typography,
  Box,
  Link,
} from "@mui/material";
import SearchIconAndFunction from "@/app/components/SearchIconAndFunction";

const YOUTUBE_SEARCH_API_URI = "https://www.googleapis.com/youtube/v3/search";
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const formatDate = (publishedAt: string) => {
  const date = new Date(publishedAt);
  return date.toLocaleString("ja-JP");
};

const showResults = () => {
  const [searchedResults, setSearchedResults] =
    useRecoilState(searchedVideoData);
  const [videoData, setVideoData] = useRecoilState(videoDetails);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageTokens, setPrevPageTokens] = useState<string[]>([]);

  const router = useRouter();
  const params = useParams();
  const query: string = Array.isArray(params.slug)
    ? params.slug.join(" ")
    : params.slug;
  const { currentUser }: any = useAuth();

  useEffect(() => {
    if (!currentUser) router.replace("/signin");
  }, [currentUser]);

  const fetchVideos = async (pageToken?: string) => {
    if (!API_KEY) {
      console.error("API_KEY is undefined");
      return;
    }

    const params = {
      key: API_KEY,
      part: "snippet",
      q: query,
      type: "video",
      maxResults: "5",
      pageToken: pageToken || '',
      order: "relevance",
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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [query]);

  const handleNextPage = async () => {
    if (nextPageToken) {
      setPrevPageTokens(prev => [...prev, nextPageToken]);
      await fetchVideos(nextPageToken);

      window.scroll({
        behavior: "smooth",
      });
    }
  };

  const handlePrevPage = async () => {
    if (prevPageTokens.length > 0) {
      const previousToken = prevPageTokens.pop()!;
      setPrevPageTokens([...prevPageTokens]); // 配列を更新
      await fetchVideos(previousToken);
      window.scroll({
        behavior: "smooth",
      });
    }
  };

  const saveVideoDetails = (item: Item) => {
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
  };

  return (
    <>
      <Box
        sx={{
          width: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 6,
        }}
      >
        <SearchIconAndFunction />
      </Box>
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
      <Box>
        {searchedResults?.map((item: Item, index: number) => (
          <Box className="item" key={index} sx={{ mb: 2 }}>
            <Link
              sx={{ textDecoration: "none" }}
              href={"/watchAndEdit/" + item.id.videoId}
              onClick={() => saveVideoDetails(item)}
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
        ))}
      </Box>
    </>
  );
};

export default showResults;
