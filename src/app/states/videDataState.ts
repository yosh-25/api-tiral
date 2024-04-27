import { atom } from 'recoil';
import { Data } from '@/types';

export const videoDataState = atom<Data | undefined>({
  key: 'videoDataState',  // 一意のキー
  default: undefined,     // 初期値は未定義または空のデータ構造
});