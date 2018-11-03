import { Injectable } from "@angular/core";
import { WordInterface } from "../../../../common/interface/word-interface";
import { GameObservableService } from "./game-observable.service";
import { BLACK_CELL } from "./grid/constant";
import { Router } from "@angular/router";
import * as Url from "../../../../common/communication/communication-url";

export const DIMENSION: number = 10;
export const WANT_REPLAY: boolean = true;
const NOT_FOUND: number = -1;
const TOTAL_SCORE: number = 2;
const VICTORY: boolean = true;

@Injectable()
export class InfoService {
    public words: WordInterface[];
    private _grid: string[][];
    public gridDifficulty: string;
    public cheatMode: boolean;
    public wordCount: number[];
    public wordFlags: number[];
    public currentPlayer: number;
    public replay: boolean[];
    private _victory: boolean;

    public constructor(
        private observable: GameObservableService,
        private router: Router,
    ) {

        this.reset();
        this.observable.getIndexCompletedWord().subscribe((index: number) => {
            this.aWordIsCompleted(index, this.currentPlayer);
        });
        this.observable.getIndexSecondPlayerCompletedWord().subscribe((index: number) => {
            this.aWordIsCompleted(index, this.otherPlayer());
        });
        this.currentPlayer = 0;
    }

    private initWordFlags(): void {
        for (let i: number = 0; i < this.words.length; i++) {
            this.wordFlags[i] = NOT_FOUND;
        }
    }

    private initGrid(): void {
        this._grid = [];
        for (let i: number = 0; i < DIMENSION; i++) {
            this._grid[i] = [];
        }
        for (let i: number = 0; i < DIMENSION; i++) {
            for (let j: number = 0; j < DIMENSION; j++) {
                this._grid[i][j] = BLACK_CELL;
            }
        }
    }

    private calculateXPosition(word: WordInterface, index: number): number {
        return word.x + index * word.orientation;
    }

    private calculateYPosition(word: WordInterface, index: number): number {
        return word.y + index * (1 - word.orientation);
    }

    private aWordIsCompleted(index: number, player: number): void {
        if (this.wordFlags[index] === -1) {
            this.wordFlags[index] = player;
            this.wordCount[TOTAL_SCORE]--;
            this.wordCount[player]++;
        }
        if (this.wordCount[TOTAL_SCORE] === 0) {
            if (this.wordCount[this.currentPlayer] > this.wordCount[this.otherPlayer()]) {
                this._victory = VICTORY;
            }
            this.router.navigate([Url.CROSSWORD_BOARD_URL + Url.CROSSWORD_VICTORY]);
        }
    }

    public otherPlayer(): number {
        return 1 - this.currentPlayer;
    }

    public createGridFromWords(): void {
        for (const word of this.words) {
            for (let i: number = 0; i < word.word.length; i++) {
                this._grid[this.calculateXPosition(word, i)][this.calculateYPosition(word, i)] = word.word.charAt(i);
            }
        }
        this.initWordFlags();
    }

    public reset(): void {
        this.initGrid();
        this.cheatMode = false;
        this.words = [];
        this.wordFlags = [];
        this.wordCount = [0, 0, 0];
        this.replay = [!WANT_REPLAY, !WANT_REPLAY];
    }

    public changeWords(words: WordInterface[]): void {
        this.reset();
        this.words = words;
        this.wordCount = [0, 0, this.words.length];
        this.createGridFromWords();
    }

    public get grid(): string[][] {
        return this._grid;
    }

    public get victory(): boolean {
        return this._victory;
    }
}
