import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

import { useRecoilState } from "recoil";
import { videoDetails, searchedVideoData } from "@/app/states/videoDataState";
import { Data, Item, Memo } from "@/types";

const YOUTUBE_SEARCH_API_URI = "https://www.googleapis.com/youtube/v3/search";
const youtubeUrl = "https://www.youtube.com/watch?v=";
const channelUrl = "https://www.youtube.com/channel/";
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

interface VideoFetcherProps {
  searchTerm: string;
}

const VideoFetcher: React.FC<VideoFetcherProps> = ({ searchTerm }) => {
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

  const fetchVideos = async () => {
    //クエリ文字列を整理する
    const params = {
      key: API_KEY,
      part: "snippet",
      q: searchTerm, //検索ワード
      type: "video",
      maxResults: "50", //表示する動画数
      pageToken: "", // 次50個の検索表示用
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
        console.log('結果', searchedResults);
      }
    //   if (result.nextPageToken) {
    //     setNextPageToken(result.nextPageToken);
    //   }
    //   if (pageToken) {
    //     setPrevPageTokens((prevTokens) => [...prevTokens, pageToken]);
    //   }
    } catch (error) {
      console.error(error);
    }
  };
  fetchVideos();

  return null;
};

export default VideoFetcher;
