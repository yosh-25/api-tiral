import { atom } from 'recoil';

export interface Data {
  items?: Item[];
}
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

// export type Memo = {
//   id: string;
//   videoId: string;

// }


export interface MemoList {
  memos?: Memo[];
}

export interface Memo {
  id: string;
  videoId: string;
  videoTitle: string;
  videoThumbnail?: string;
  createdTime: string;
  createdAt: string;
  content: string;
}

