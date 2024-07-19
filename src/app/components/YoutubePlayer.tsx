import { Box } from "@mui/material";
import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";

interface YouTubePlayerProps {
  videoId: string;
  onReady: (event: { target: YT.Player }) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onReady }) => {
  const opts: YouTubeProps['opts'] = {
    width: "100%",
    height: "100%",
  };

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        paddingBottom: "56.25%", // 16:9のアスペクト比
        height: 0,
        overflow: "hidden",
      }}
    >
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      />
    </Box>
  );
};

export default YouTubePlayer;