import { WordPlaceHolder } from "./word-placeholder";
import { Orientation, Difficulty, WordInterface } from "../../../common/interface/word-interface";
import { Letter } from "./letter";
export const BLACK_CELL: string = "#";
export const EMPTY_LETTER: string = "";
export const LETTER_NOT_FOUND: string = "*";
export const FIRST_WORD_INDEX: number = 0;
const ACCEPTABLE_COMPLETION_RATIO: number = 0.7;
const BACKTRACK_ITERATE: number = 2;
const SECONDE_WORD_INDEX: number = 1;
const LENGTH_TOO_SHORT: number = 1;
const MAX_WORD_LINKED: number = 2;
const MAX_WORD_INTERLINKED_LOCAL: number = 5;
const MAX_WORD_INTERLINKED_GLOBAL: number = 65;
const NB_OF_ORIENTATION: number = 2;
const NEXT_INDEX: number = 1;
const MAX_COUNT: number = 5;
const TIMEOUT: number = 70;
const WORD_NOT_USED: number = -1;

export class WordGenerator {
    public static async generateWords(wordsPlaceHolders: WordPlaceHolder[], difficulty: Difficulty): Promise <WordInterface[]> {
        const words: WordInterface[] = [];
        for (let i: number = 0; i < wordsPlaceHolders.length; i++) {
            words[i] = wordsPlaceHolders[i].word;
            words[i].word = await wordsPlaceHolders[i].searchWord(difficulty);
            words[i].definition = await wordsPlaceHolders[i].getWordDefinition(difficulty);
        }

        return words;
    }

    public static wordCount(grid: Letter[][]): WordPlaceHolder[] {
        let wordsPlaceHoldersPlaceHolder: WordPlaceHolder[] = [];
        wordsPlaceHoldersPlaceHolder = this.iterateWord(wordsPlaceHoldersPlaceHolder, grid, Orientation.horizontal);
        grid = this.transposeGrid(grid);
        wordsPlaceHoldersPlaceHolder = this.iterateWord(wordsPlaceHoldersPlaceHolder, grid, Orientation.vertical);
        grid = this.transposeGrid(grid);
        wordsPlaceHoldersPlaceHolder = this.sortByLength(wordsPlaceHoldersPlaceHolder);

        return wordsPlaceHoldersPlaceHolder;
    }

    private static iterateWord(wordsPlaceHolder: WordPlaceHolder[], grid: Letter[][], orientation: Orientation): WordPlaceHolder[] {
        for (let outsideIterator: number = 0; outsideIterator < grid.length; outsideIterator++) {
            let newConstraint: Letter[] = [];
            for (let insideIterator: number = 0; insideIterator < grid.length; insideIterator++) {
                newConstraint = this.manageCreationPlaceHolder(outsideIterator, insideIterator, grid, orientation,
                                                               newConstraint, wordsPlaceHolder);
            }
        }

        return wordsPlaceHolder;
    }

    private static transposeGrid(grid: Letter[][]): Letter[][] {
        return grid[FIRST_WORD_INDEX].map((col: Letter, i: number) => grid.map((row: Letter[]) => row[i]));
    }

    public static async  createFilledGrid(grid: Letter[][], wordsPlaceHolder: WordPlaceHolder[], difficulty: Difficulty): Promise<boolean> {
        const created: boolean = await this.searchWords(grid, wordsPlaceHolder, difficulty);
        if (created) {
            grid = this.fillHole(grid);
            wordsPlaceHolder = this.wordCount(grid);
        }

        return created;
    }

    private static manageCreationPlaceHolder(i: number, j: number, grid: Letter[][], orientation: Orientation,
                                             constraint: Letter[], placeHolder: WordPlaceHolder[]): Letter[] {
        if (!this.isBlackCells(grid, i, j)) {
            constraint[constraint.length] = grid[i][j];
            if (this.isTheEndOfAWord(grid, i, j)) {
                this.creationNewWordPlaceholder(i, j, grid, orientation, constraint, placeHolder);
                constraint = [];
            }
        }

        return constraint;
    }

    private static creationNewWordPlaceholder(i: number, j: number, grid: Letter[][], orientation: Orientation, constraint: Letter[],
                                              wordsPlaceHolder: WordPlaceHolder[]): void {
        if (this.longerThanOne(constraint.length)) {
            this.addNewWord(this.calculatePosX(i, j, orientation, constraint.length),
                            this.calculatePosY(i, j, orientation, constraint.length), orientation, constraint, wordsPlaceHolder);
        }
    }

    private static searchTimeout(count: number): boolean {
        return count > TIMEOUT;
    }

    private static isAcceptableFoundWordsRatio(wordsPlaceHolders: WordPlaceHolder[]): boolean {
        return this.completedWords(wordsPlaceHolders) / wordsPlaceHolders.length > ACCEPTABLE_COMPLETION_RATIO;
    }

    private static async searchWords(grid: Letter[][], wordsPlaceHolders: WordPlaceHolder[], difficulty: Difficulty): Promise <boolean> {
        let count: number = 0;
        let created: boolean = true;
        let backtrack: boolean = false;
        const requestedWords: string[] = [];

        for (let i: number = 0; i < wordsPlaceHolders.length; i++) {
            count++;
            if (this.searchTimeout(count)) {
                created = this.isAcceptableFoundWordsRatio(wordsPlaceHolders);

                return created;
            }
            if (!await this.placeWord(wordsPlaceHolders, wordsPlaceHolders[i], backtrack, difficulty, requestedWords)) {
                i = i - BACKTRACK_ITERATE;
                backtrack = true;
            } else {
                backtrack = false;
            }
        }

        return created;
    }
    private static async placeWord(wordsPlaceHolders: WordPlaceHolder[], word: WordPlaceHolder, backtrack: boolean,
                                   difficulty: Difficulty, requestedWords: string[]): Promise <boolean> {
        let placeable: boolean = false;
        let requestedWord: string = EMPTY_LETTER;
        this.initPlaceholderState(word, backtrack);

        while (!placeable && this.lessThanFiveTimes(word, wordsPlaceHolders)) {
            requestedWord = await word.searchWord(difficulty);
            if (this.cantFindWord(requestedWord)) {
                return false;
            }
            placeable = await this.connectedWordsFound(word, requestedWord, difficulty) && this.wordNotUsed(requestedWords, requestedWord);
            if (!placeable) {
                this.replaceOldConstraint(word);
            }
        }
        if (!placeable) {
            this.resetWordState(word);
            requestedWords.pop();
        } else {
            requestedWords.push(requestedWord);
        }

        return placeable;
    }

    private static wordNotUsed(requestedWords: string[], requestedWord: string): boolean {
        return requestedWords.indexOf(requestedWord) === WORD_NOT_USED;
    }

    private static async connectedWordsFound(wordsPlaceHolders: WordPlaceHolder,
                                             requestedWord: string, difficulty: Difficulty): Promise<boolean> {
        wordsPlaceHolders.addTriedWord(requestedWord);
        this.updatePlaceHolderConstraints(wordsPlaceHolders, requestedWord);

        return  this.wordsCompatible(wordsPlaceHolders, difficulty);
    }

    private static initPlaceholderState(wordsPlaceHolder: WordPlaceHolder, backtrack: boolean): void {
        if (!backtrack) {
            wordsPlaceHolder.saveOldConstraints();
        }
        this.replaceOldConstraint(wordsPlaceHolder);
    }

    private static replaceOldConstraint(wordsPlaceHolders: WordPlaceHolder): void {
        this.updatePlaceHolderConstraints(wordsPlaceHolders, wordsPlaceHolders.oldConstraints);
    }

    private static lessThanFiveTimes(wordsPlaceHolders: WordPlaceHolder, words: WordPlaceHolder[]): boolean {
        return wordsPlaceHolders.triedWords.length < MAX_COUNT || words[FIRST_WORD_INDEX] === wordsPlaceHolders;
    }

    private static resetWordState(wordsPlaceHolders: WordPlaceHolder): void {
        wordsPlaceHolders.removeAllTriedWords();
        this.updatePlaceHolderConstraints(wordsPlaceHolders, wordsPlaceHolders.oldConstraints);
    }

    private static updatePlaceHolderConstraints(wordsPlaceholders: WordPlaceHolder, reqWord: string): void {
        for (let i: number = 0; i < wordsPlaceholders.length; i++) {
            wordsPlaceholders.updateConstraint(i, reqWord.charAt(i));
        }
    }
    private static  async wordsCompatible(wordsPlaceHolders: WordPlaceHolder, difficulty: Difficulty): Promise <boolean> {
        let compatible: boolean = true;
        const constraints: Letter[] = wordsPlaceHolders.constraints;
        for (const letter of constraints) {
            if (this.longerThanOne(letter.inWords.length)) {
                const connectedWord: WordPlaceHolder =
                (letter.inWords[FIRST_WORD_INDEX] === wordsPlaceHolders) ?
                letter.inWords[SECONDE_WORD_INDEX] :
                letter.inWords[FIRST_WORD_INDEX];
                if (this.cantFindWord( await connectedWord.searchWord(difficulty))) {
                    compatible = false;
                }
            }
        }

        return compatible;
    }
    public static tooManyLinks(wordsPlaceHolders: WordPlaceHolder[]): boolean {
        let globalLinks: number = 0;
        let areThereTooManyLinks: boolean = false;
        for (const placeHolder of wordsPlaceHolders) {
            let nbWordsLinked: number = 0;
            for (const constraint of placeHolder.constraints) {
                if (this.letterLinkedToTwoWords(constraint)) {
                    nbWordsLinked++;
                    globalLinks++;
                }
            }
            if (this.tooMuchWordLinkedToAWord(nbWordsLinked) || this.tooMuchWordLinkedGlobally(globalLinks)) {
                areThereTooManyLinks = true;
            }
        }

        return areThereTooManyLinks;
    }
    private static completedWords(wordsPlaceHolders: WordPlaceHolder[]): number {
        let count: number = 0;
        for (const placeHolder of wordsPlaceHolders) {
            let completed: boolean = true;
            for (const constraint of placeHolder.constraints) {
                if (!this.letterIsFound(constraint)) {
                    completed = false;
                }
            }
            if (completed) {
                count++;
            }
        }

        return count;

    }
    private static letterIsFound(letter: Letter): boolean {
        return letter.value !== LETTER_NOT_FOUND;
    }
    private static fillHole(grid: Letter[][]): Letter[][] {
        for (let i: number = 0; i < grid.length; i++) {
            for (let j: number = 0; j < grid.length; j++) {
                if (this.isALetterNotFound(i, j, grid)) {
                    this.fillWithBlackCell(i, j, grid);
                }
            }
        }

        return grid;
    }
    private static sortByLength(wordsPlaceHolders: WordPlaceHolder[]): WordPlaceHolder[] {
        wordsPlaceHolders.sort((word1: WordPlaceHolder, word2: WordPlaceHolder) => {
            return word2.length - word1.length;
        });

        return wordsPlaceHolders;
    }
    private static longerThanOne(length: number): boolean {
        return length > LENGTH_TOO_SHORT;
    }
    private static cantFindWord(word: string): boolean {
        return word === EMPTY_LETTER;
    }
    private static letterLinkedToTwoWords(letter: Letter): boolean {
        return letter.inWords.length === MAX_WORD_LINKED;
    }
    private static tooMuchWordLinkedToAWord(nbwordsPlaceHoldersLinked: number): boolean {
        return nbwordsPlaceHoldersLinked >= MAX_WORD_INTERLINKED_LOCAL;
    }
    private static tooMuchWordLinkedGlobally(globalLinks: number): boolean {
        return globalLinks > MAX_WORD_INTERLINKED_GLOBAL;
    }
    private static isBlackCells(grid: Letter[][], i: number, j: number): boolean {
        return grid[i][j].value === BLACK_CELL;
    }
    private static calculatePosX(i: number, j: number, orientation: Orientation, length: number): number {
        return (i * ((orientation + NEXT_INDEX) % NB_OF_ORIENTATION)) + (j - length + NEXT_INDEX) * (orientation);
    }
    private static calculatePosY(i: number, j: number, orientation: Orientation, length: number): number {
        return ((j - length + NEXT_INDEX) * ((orientation + NEXT_INDEX) % NB_OF_ORIENTATION)) + i * orientation;
    }
    private static isTheEndOfAWord(grid: Letter[][], outsideIterator: number, insideIterator: number): boolean {
        return insideIterator >= grid.length - NEXT_INDEX ||
            grid[outsideIterator][insideIterator + NEXT_INDEX].value === BLACK_CELL;
    }
    private static addNewWord(x: number, y: number, orientation: Orientation, constraint: Letter[],
                              wordsPlaceHolders: WordPlaceHolder[]): void {
        wordsPlaceHolders[wordsPlaceHolders.length] = new WordPlaceHolder(x, y, orientation, constraint);
    }
    private static isALetterNotFound(i: number, j: number, grid: Letter[][]): boolean {
        return grid[i][j].value === LETTER_NOT_FOUND;
    }
    private static fillWithBlackCell(i: number, j: number, grid: Letter[][]): void {
        grid[i][j].value = BLACK_CELL;
    }
}
