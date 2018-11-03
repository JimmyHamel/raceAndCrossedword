import { Word, DICTIONNARY } from "./dictionnary";
import * as request from "request-promise-native";
const URI_API_DEFINITION: string = "https://api.datamuse.com/words?sp=";
const PARAMETER_FOR_DEFENITION: string = "&md=d";
const FILLER_CHAR: string = "*";

export class LexicalRequest {

    public async getApiResponse(word: string, difficulty: string): Promise<string> {
        try {

            return request({
                uri: URI_API_DEFINITION + word + PARAMETER_FOR_DEFENITION,
                resolveWithFullResponse: true,
                json: true
            });

        } catch (err) {
            return null;
        }
    }

    public getRandomWord(constraints: string, rarety: string): string {
        const wordsFound: string[] = this.getAllWords(constraints, rarety);
        if (wordsFound.length === 0) {
            return null;
        } else {
            return wordsFound[Math.floor(Math.random() * wordsFound.length)];
        }
    }

    public getAllWords(constraints: string, raretyString: string): string[] {
        const wordsFound: string[] = [];
        for (const word of DICTIONNARY) {
            if (raretyString === word.rarety && constraints.length === word.word.length) {
                if (this.checkWordConstraints(constraints, word)) {
                    wordsFound.push(word.word);
                }
            }
        }

        return wordsFound;
    }

    private checkWordConstraints(constraints: string, word: Word): boolean {
        for (let wordIter: number = 0; wordIter < constraints.length; wordIter++) {
            if (constraints.substr(wordIter, 1) !== FILLER_CHAR && word.word.substr(wordIter, 1) !== constraints.substr(wordIter, 1)) {
                return false;
            }
        }

        return true;
    }
}
