import { Difficulty } from "./word-interface";

export interface Room{
    name: string;
    difficulty: Difficulty;
    playerPresent: number;
    playerTotal: number;
    playersname: Array<string>;
  }