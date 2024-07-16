import { atom } from 'recoil';
import { VideoItem, Memo } from '@/types';

const sessionStorageEffect = (key: string) => ({ setSelf, onSet }: any) => {
  if (typeof window === "undefined") return;
  const savedValue = sessionStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue: any, _: any, isReset: boolean) => {
    isReset
      ? sessionStorage.removeItem(key)
      : sessionStorage.setItem(key, JSON.stringify(newValue));
  });
};

export const videoDetails = atom<Memo>({
  key: 'videoDetails',  // 一意のキー
  default: undefined,     // 初期値は未定義または空のデータ構造
  effects: [sessionStorageEffect("videoDetails")]
});

export const searchedVideoData = atom<VideoItem[]>({
  key: 'searchedVideoData',  // 一意のキー
  default: [],     // 初期値は未定義または空のデータ構造
  effects: [sessionStorageEffect("searchedVideoData")]
});

export const videoIdState = atom({
  key: 'videoId',
  default: ''
});