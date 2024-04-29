import { atom } from 'recoil';
import { Data } from '@/types';

const localStorageEffect = (key: string) => ({ setSelf, onSet }) => {
  if (typeof window === "undefined") return;
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue: any, _: any, isReset: boolean) => {
    isReset
      ? localStorage.removeItem(key)
      : localStorage.setItem(key, JSON.stringify(newValue));
  });
};

export const videoDataState = atom<Data | undefined>({
  key: 'videoDataState',  // 一意のキー
  default: undefined,     // 初期値は未定義または空のデータ構造
  effects: [localStorageEffect("localstorage-example")]
});



export const counterState = atom({
  key: 'counterState',  // 一意のキー
  default: 1,           // 初期値
  effects: [localStorageEffect("localstorage-example")]
});

