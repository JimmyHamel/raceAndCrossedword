import * as request from "request-promise-native";
import { Letter } from "./letter";
import { Orientation, Difficulty, WordInterface } from "../../../common/interface/word-interface";
import { ApiResponseWord, ApiResponseDefinition } from "../../../common/interface/api-response-interface";
import * as URL from "../../../common/communication/communication-url";
import { LETTER_NOT_FOUND, EMPTY_LETTER } from "./word-generator";
const TWO_LETTER_WORD: number = 2;
const ERROR_CODE: number = 400;
export class WordPlaceHolder {
    private _wordInformation: WordInterface;
    private _constraints: Letter[];
    private _oldConstraints: string;
    private _triedWords: string[];
    public constructor(x: number, y: number, newOrientation: Orientation, newConstraints: Letter[]) {
        this._wordInformation = {
            x: x, y: y, orientation: newOrientation,
            word: EMPTY_LETTER, definition: EMPTY_LETTER
        };
        this._constraints = newConstraints;
        this._oldConstraints = EMPTY_LETTER;
        this._triedWords = [LETTER_NOT_FOUND];
        this.linkLettersToWord();
    }
    public get word(): WordInterface {
        return this._wordInformation;
    }

    private getConstraintsValues(): string {
        let constraintsValues: string = EMPTY_LETTER;
        for (const constraint of this._constraints) {
            constraintsValues += constraint.value;
        }

        return constraintsValues;
    }
    public addTriedWord(word: string): void {
        this._triedWords.push(word);
    }
    public removeAllTriedWords(): void {
        this._triedWords = [LETTER_NOT_FOUND];
    }
    public get triedWords(): string[] {
        return this._triedWords;
    }
    public async searchWord(difficulty: Difficulty): Promise<string> {
        let url: string;
        if (difficulty === Difficulty.easy || this._constraints.length === TWO_LETTER_WORD) {
            url = URL.BASE_SERVER_URL + URL.SERVICE_LEXICAL_URL + URL.WORD_URL +
                this.getConstraintsValues().toLowerCase() + URL.RARETY_URL + URL.COMMON_URL;
        } else if (difficulty === Difficulty.medium || difficulty === Difficulty.hard) {
            url = URL.BASE_SERVER_URL + URL.SERVICE_LEXICAL_URL + URL.WORD_URL +
                this.getConstraintsValues().toLowerCase() + URL.RARETY_URL + URL.UNCOMMON_URL;
        }

        let res: string = EMPTY_LETTER;
        try {
            const req: ApiResponseWord  = await request({uri: url, json: true}).promise();

            if (req.status as number !== ERROR_CODE) {
                res = req.word as string;
            }

        } catch (err) {
            res = EMPTY_LETTER;
        }

        return res;
    }
    public async getWordDefinition(difficulty: Difficulty): Promise<string> {
        let url: string;
        if (difficulty === Difficulty.easy || difficulty === Difficulty.medium) {
            url = URL.BASE_SERVER_URL + URL.SERVICE_LEXICAL_URL + URL.DEFINITION_URL +
                this.getConstraintsValues() + URL.DIFFICULTY_URL + URL.EASY_DEF_URL;
        } else if (difficulty === Difficulty.hard) {
            url = URL.BASE_SERVER_URL + URL.SERVICE_LEXICAL_URL + URL.DEFINITION_URL +
            this.getConstraintsValues() + URL.DIFFICULTY_URL + URL.HARD_DEF_URL;
        }

        let res: string = EMPTY_LETTER;
        try {
            const req: ApiResponseDefinition  = await request({uri: url, json: true}).promise();

            if (req.status !== ERROR_CODE) {
                res = req.definition;
            }

        } catch (err) {
            res = EMPTY_LETTER;
        }

        return res;
    }

    public updateConstraint(position: number, constraint: string): void {
        this._constraints[position].value = constraint;
    }

    public get length(): number {
        return this._constraints.length;
    }
    private linkLettersToWord(): void {
        for (const constraint of this._constraints) {
            constraint.addWord(this);
        }
    }
    public saveOldConstraints(): void {
        this._oldConstraints = EMPTY_LETTER;
        for (const constraint of this._constraints) {
            this._oldConstraints += constraint.value;
        }
    }
    public get oldConstraints(): string {
        return this._oldConstraints;
    }
    public get constraints(): Letter[] {
        return this._constraints;
    }

}
