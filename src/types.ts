import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export interface AuthContextType {
  currentUser: User | null;
}
export interface Data {
  items?: Item[];
}

export interface MemosByVideoId {
  [videoId: string]: Memo[];
}

export interface Memo {
  id: string;
  videoId: string;
  videoTitle: string;
  videoThumbnail: string | undefined;
  createdTime: Timestamp;
  createdAt: string;
  content: string;
  isEditing?: boolean;
  uid: string | undefined;
}

export type MemoList =Memo[];

export interface TimestampsByVideoId {
  [videoId: string]: string[]
;}

export interface LatestTimestampByVideoId {
  [videoId: string]: Timestamp
;}

export interface Item {
  id: { videoId: string },
    snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails?: {
      medium: {
        url: string;
      };
    };
    channelTitle: string;
    channelId: string;
  };
}

export interface PageApi {
  [videoId: string]: number;
}
