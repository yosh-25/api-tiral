import { atom, AtomEffect, DefaultValue } from "recoil";
import { VideoItem, Memo } from "@/types";

const sessionStorageEffect =
  <T>(key: string): AtomEffect<T>=>
  ({ setSelf, onSet }) => {
    // サーバーサイド環境ではセッションストレージを使用しない
    if (typeof window === "undefined") return;

    // セッションストレージから保存された値を取得、設定
    const savedValue = sessionStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    // atomの値が変更されたときのコールバックを設定
    onSet((newValue: T, _: T | DefaultValue, isReset: boolean) => {
      isReset
        ? sessionStorage.removeItem(key)
        : sessionStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const videoDetails = atom<Memo>({
  key: "videoDetails", // 一意のキー
  default: undefined, // 初期値は未定義または空のデータ構造
  effects: [sessionStorageEffect("videoDetails")],
});

export const searchedVideoData = atom<VideoItem[]>({
  key: "searchedVideoData",
  default: [],
  effects: [sessionStorageEffect("searchedVideoData")],
});

export const videoIdState = atom<string>({
  key: "videoId",
  default: "",
});
