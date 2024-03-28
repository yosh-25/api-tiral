export type Word = {
    id: string,
    spelling: string,
    meaning: string,
    translation: string,
    registeredDate: string;
    status: boolean,
    }

export type FilterByStatus = '〇' | '×' | '全て';

export type StatusOptions = {
    value: string,
    label: string
}