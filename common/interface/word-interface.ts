export const enum Difficulty{
    easy,
    medium,
    hard
}

export const enum Orientation{
    horizontal,
    vertical
}

export interface WordInterface{
    x:number;
    y:number;
    orientation:Orientation;
    word:string;
    definition:string;
}