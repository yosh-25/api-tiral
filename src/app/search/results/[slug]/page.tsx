"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";
import { useRecoilState } from "recoil";
import { videoDetails, searchedVideoData } from "@/videoDataState";
import { Item, Memo } from "@/types";
import { Button, Typography, Box, Link } from "@mui/material";
import SearchIconAndFunction from "@/app/components/SearchIconAndFunction";
import { Timestamp } from "firebase/firestore";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const formatDate = (publishedAt: string) => {
  const date = new Date(publishedAt);
  return date.toLocaleString("ja-JP");
};

const ShowResults = () => {
  const [searchedResults, setSearchedResults] = useState<Item[]>();
  const [videoData, setVideoData] = useRecoilState(videoDetails);
  const [displayedResults, setDisplayedResults] = useState<Item[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const router = useRouter();
  const params = useParams();
  const query: string = Array.isArray(params.slug) ? params.slug.join(" ") : params.slug;
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) router.replace("/signin");
  }, [currentUser, router]);

  const apiKey = API_KEY;
  const searchQuery = query;
  const maxResults = 24;
  const order = "relevance";

  const fetchVideos = async () => {
    if (!API_KEY) {
      console.error("API_KEY is undefined");
      return;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=${maxResults}&order=${order}&key=${apiKey}`
      );
      const result = await response.json();
      setSearchedResults(result.items);
      console.log(result);
    }   catch (error) {
      console.error(error);
    }  
  };

  useEffect(() => {
    fetchVideos();
  }, [query]);

  useEffect(() => {
    console.log(searchedResults);
  }, [searchedResults]);

  useEffect(()=> {
    const startIndex = (currentPage -1) * 6;
    const endIndex = startIndex + 6;
    setDisplayedResults(searchedResults?.slice(startIndex, endIndex));
}, [searchedResults, currentPage]);

const handleNextPage = () => {
  if(!searchedResults) return;
  if ((currentPage * 5) < searchedResults.length) {
    setCurrentPage(prevPage => prevPage + 1);
  }
};

const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(prevPage => prevPage - 1);
  }
};

  const saveVideoData = (item: Item) => {
    const videoData: Memo = {
      id: "",
      videoId: item.id.videoId,
      videoThumbnail: item.snippet.thumbnails?.medium.url,
      videoTitle: item.snippet.title,
      createdTime: Timestamp.now(),
      createdAt: "",
      content: "",
      uid: currentUser?.uid,
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // 幅が狭いデバイスでは1カラム
            md: "1fr 1fr", // 幅が中程度のデバイスでは2カラム
            lg: "1fr 1fr 1fr", // PC画面（幅が広いデバイス）では3カラム
          },
          gap: 2, // カラム間の間隔を設定
          mt: 4,
        }}
      >
        {displayedResults?.map((item: Item, index: number) => (
          <Box
            className="item"
            key={index}
            sx={{
              mb: { sx: "1em", md: "2em" },
              border: { md: "1px solid #ddd" },
              borderRadius: "4px",
              p: { md: "1em" },
            }}
          >
            <Link
              sx={{ textDecoration: "none" }}
              href={"/watchAndEdit/" + item.id.videoId}
              onClick={() => saveVideoData(item)}
            >
              <Box className="thumbnail">
                <img
                  src={item.snippet?.thumbnails?.medium?.url}
                  alt={item.snippet?.title}
                  width={"100%"}
                />
              </Box>
              <Box className="right" sx={{ p: "0.6em" }}>
                <Box className="title">
                  <Typography>{item.snippet?.title}</Typography>
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
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mb:'2em'}}>
        <Button
          variant="contained"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          前のページ
        </Button>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={currentPage * 6 >= (searchedResults?.length || 0)}
          sx={{ml: '2em'}}
        >
          次のページ
        </Button>
      </Box>
    </>
  );
};

export default ShowResults;
