import { WordGenerator, EMPTY_LETTER } from "./word-generator";
import { GridGenerator } from "./grid-generator";
import { Letter } from "./letter";
import { WordPlaceHolder } from "./word-placeholder";
import { Difficulty } from "../../../common/interface/word-interface";
import { CrossedWord } from "./crossedword";

const DEF_MOT_SANS_DEF: string = "mystery word";

export class CrossedWordsGenerator {
    private _crossedWords: CrossedWord[];

    public constructor() {
        this._crossedWords = [];
    }

    public async generateNewCrossedWord(gridSize: number, difficulty: Difficulty): Promise <CrossedWord> {
        let created: boolean = false;
        let grid: Letter[][];
        let wordsPlaceHolders: WordPlaceHolder[];
        while (!created) {
            do {
                grid = GridGenerator.generateBaseGrid(gridSize);
                wordsPlaceHolders = WordGenerator.wordCount(grid);
            }while (!this.isAGoodModelGrid(wordsPlaceHolders));
            created = await WordGenerator.createFilledGrid(grid, wordsPlaceHolders, difficulty);
            wordsPlaceHolders = WordGenerator.wordCount(grid);
        }
        this._crossedWords[this._crossedWords.length] = {
            grid: grid,
            words: await WordGenerator.generateWords(wordsPlaceHolders, difficulty),
            difficulty: difficulty
        };
        this.fixWordsWithoutDef(this._crossedWords[this._crossedWords.length - 1]);

        return this._crossedWords[this._crossedWords.length - 1];
    }

    private fixWordsWithoutDef(crossedWord: CrossedWord): void {
        for (const word of crossedWord.words) {
            if (word.definition === EMPTY_LETTER) {
                word.definition = DEF_MOT_SANS_DEF;
            }
        }
    }

    private isAGoodModelGrid(wordsPlaceHolders: WordPlaceHolder[]): boolean {
        return !WordGenerator.tooManyLinks(wordsPlaceHolders);
    }
}
