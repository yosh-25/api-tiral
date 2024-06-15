import React from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

interface YouTubePlayerProps {
    videoId: string;
    onReady: (event: { target: YT.Player }) => void;
  }

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onReady }) => {
  const opts = {
    width: {
        xs: '80%',
        lg:"70%"
    },
    height: "400px",
    aspectRatio: "0.5",
  };

  return <YouTube videoId={videoId} opts={opts} onReady={onReady} />;
};

export default YouTubePlayer;
