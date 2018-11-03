import { Letter } from "./letter";
import { Difficulty, WordInterface } from "../../../common/interface/word-interface";
export interface CrossedWord {
    grid: Letter[][];
    words: WordInterface[];
    difficulty: Difficulty;
}
