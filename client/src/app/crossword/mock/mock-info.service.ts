import { Injectable } from "@angular/core";
import { WordInterface } from "../../../../../common/interface/word-interface";
import { MockGrid } from "./mock-grid";
import { BLACK_CELL } from "../grid/constant";
import { DIMENSION } from "../info.service";

const ORIENTATION_MODULO: number = 2;
const NOT_FOUND: number = -1;

@Injectable()
export class MockInfoService {
    public words: WordInterface[];
    private _grid: string[][];
    public gridDifficulty: string;
    private mockGrid: MockGrid;
    public wordCount: number[];
    public wordFlags: number[];
    public currentPlayer: number;

    public constructor() {
        this.initGrid();
        this.mockGrid = new MockGrid ();
        this.words = this.mockGrid.words;
        this.wordFlags = [];
        this.createGridFromWords();
        this.wordCount = [0, 0, 0];
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
    public createGridFromWords(): void {
        for (const word of this.words) {
            for (let i: number = 0; i < word.word.length; i++) {
                this._grid[this.calculateXPosition(word, i)][this.calculateYPosition(word, i)] = word.word.charAt(i);
            }
        }
        this.initWordFlags();
    }
    private calculateXPosition(word: WordInterface, index: number): number {
        return word.x + index * word.orientation;
    }
    private calculateYPosition(word: WordInterface, index: number): number {
        return word.y + index * ((word.orientation + 1) % ORIENTATION_MODULO);
    }
    public get grid(): string[][] {
        return this._grid;
    }
}
