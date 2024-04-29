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


export interface MemoList {
  memos?: Memo[];
}

export interface Memo {
  id: { videoId: string },
  snippet: {
    title: string;};
  time: number;
  memo: string;
}

