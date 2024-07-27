"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSetRecoilState } from "recoil";
import { videoDetails } from "@/atoms";
import { VideoItem, Memo } from "@/types/index";
import { Button, Typography, Box, Link, CircularProgress } from "@mui/material";
import SearchIconAndFunction from "@/app/components/SearchIconAndFunction";

const ShowResults = () => {
  const [searchedResults, setSearchedResults] = useState<VideoItem[]>();
  const [displayedResults, setDisplayedResults] = useState<VideoItem[]>();
  const setVideoData = useSetRecoilState(videoDetails);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const params = useParams();
  const { currentUser } = useAuth();

  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  useEffect(() => {
    if (!currentUser) router.replace("/signin");
  }, [currentUser, router]);

  //検索ワードの取得。複数の場合の処理も実施。
  const searchQuery: string = Array.isArray(params.slug)
    ? params.slug.join(" ")
    : params.slug;

  //APIに関する情報
  const apiKey = API_KEY;
  const maxResults = 24;
  const order = "relevance";

  // APIを使っての動画検索
  const fetchVideos = async () => {
    if (!API_KEY) {
      console.error("API_KEY is undefined");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=${maxResults}&order=${order}&key=${apiKey}`
      );
      const result = await response.json();
      setSearchedResults(result.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 新しい検索ワードで検索時にAPIからfetch
  useEffect(() => {
    fetchVideos();
  }, [searchQuery]);

  // APIから取得した時間情報を日本語表記に変換
  const formatDate = (publishedAt: string) => {
    const date = new Date(publishedAt);
    return date.toLocaleString("ja-JP");
  };

  // ページネーションの処理
  useEffect(() => {
    const startIndex = (currentPage - 1) * 6;
    const endIndex = startIndex + 6;
    setDisplayedResults(searchedResults?.slice(startIndex, endIndex));
  }, [searchedResults, currentPage]);

  const handleNextPage = () => {
    if (!searchedResults) return;
    if (currentPage * 6 < searchedResults.length) {
      setCurrentPage((prevPage) => prevPage + 1);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  // 閲覧する動画に関するデータをrecoilで保存
  const saveVideoData = (item: VideoItem) => {
    const videoData: Memo = {
      id: "",
      videoId: item.id.videoId,
      videoThumbnail: item.snippet.thumbnails?.medium.url,
      videoTitle: item.snippet.title,
      createdTime: undefined,
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
          width: { xs: "100%", sm: "70%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mx: { xs: "auto", md: "0" },
          mb: "48px",
        }}
      >
        <SearchIconAndFunction />
      </Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
                lg: "1fr 1fr 1fr",
              },
              gap: "16px",
              mt: "32px",
            }}
          >
            {displayedResults?.map((item: VideoItem, index: number) => (
              <Box
                className="item"
                key={index}
                sx={{
                  mb: { sx: "32px", md: "32px" },
                  border: { md: "1px solid #ddd" },
                  borderRadius: "4px",
                  p: { md: "16px" },
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
                  <Box className="right" sx={{ p: "9.6px" }}>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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
              sx={{ ml: "32px" }}
            >
              次のページ
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default ShowResults;
