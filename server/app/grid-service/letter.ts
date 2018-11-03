import {WordPlaceHolder} from "./word-placeholder";
import { LETTER_NOT_FOUND } from "./word-generator";

export class Letter {
    private _value: string;
    private _i: number;
    private _j: number;
    private _inWords: WordPlaceHolder[];
    public constructor(x: number, y: number, value: string = LETTER_NOT_FOUND) {
        this._i = x;
        this._j = y;
        this._value = value;
        this._inWords = [];
    }
    public set value(val: string) {
        this._value = val;
    }
    public get value(): string {
        return this._value;
    }
    public addWord(word: WordPlaceHolder): void {
        this._inWords[this._inWords.length] = word;
    }
    public get inWords(): WordPlaceHolder[] {
        return this._inWords;
    }
    public get i(): number {
        return this._i;
    }
    public get j(): number {
        return this._j;
    }

}
