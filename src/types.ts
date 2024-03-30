export type Word = {
    id: string,
    spelling: string,
    meaning: string,
    translation: string,
    registeredDate: string;
    status: boolean,
    }

export type StatusOption = {
    value: string,
    label: string
}