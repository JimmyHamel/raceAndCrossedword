import { Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { STATUS } from "../constant/status-code";
import { LexicalRequest } from "./lexical-request";
import { ApiResponseWord, ApiResponseDefinition,
         ApiResponseWords } from "../../../common/interface/api-response-interface";
import { RARETY_VALUES, TYPES, DIFFICULTY_VALUES, RARETY, DIFFICULTY, NO_WORD, NO_WORDS,
         NO_DEFINITION, NO_PARAMETER, INVALID_PARAMETER, BODY, DEFS } from "../constant/lexical-service-constants";

module Route {
    const DEFINITION_STARTING_INDEX: number = 2;
    @injectable()
    export class LexicalService {

        public getRandomWord(constraint: string, rarety: string, res: Response): void {
            this.handleWrongParameters(res, rarety, RARETY);

            const lexicalRequest: LexicalRequest = new LexicalRequest();
            let wordFound: string;

            wordFound = lexicalRequest.getRandomWord(constraint, rarety);

            if (wordFound === null) {
                this.sendResponse(res, {status: STATUS.badRequest, word: NO_WORD});
            } else {
                this.sendResponse(res, {status: STATUS.successfulRequest, word: wordFound});
            }
        }

        public getAllWords(constraint: string, rarety: string, res: Response ): void {
            this.handleWrongParameters(res, rarety, RARETY);

            const lexicalRequest: LexicalRequest = new LexicalRequest();
            let wordsFound: string[] = [];

            wordsFound = lexicalRequest.getAllWords(constraint, rarety);
            if (wordsFound.length === 0) {
                this.sendResponse(res, {status: STATUS.badRequest, words: [NO_WORDS]});
            } else {
                this.sendResponse(res, {status: STATUS.successfulRequest, words: wordsFound});
            }
        }

        public getWordDefinitions(word: string, difficulty: string, res: Response): void {
            this.handleWrongParameters(res, difficulty, DIFFICULTY);

            const lexicalRequest: LexicalRequest = new LexicalRequest();

            lexicalRequest.getApiResponse(word, difficulty)
                .then(((response: string) => {
                    const definition: string = this.findDefinitionByDifficulty(difficulty, response);
                    this.sendResponse(res, {status: STATUS.successfulRequest, definition: definition});
                }))
                .catch(((err: string) => {
                    this.sendResponse(res, {status: STATUS.badRequest, definition: NO_DEFINITION});
            }));
        }

        private sendResponse(res: Response, content: ApiResponseWord | ApiResponseDefinition | ApiResponseWords): void {
            if (!this.hasInternalError(res)) {
                res.json(content);
            }
        }

        private handleWrongParameters(res: Response, parameter: string, type: string): void {
            let lowerCaseParam: string;

            try {
                lowerCaseParam = parameter.toLowerCase();
            } catch (err) {
                this.sendResponse(res, {status: STATUS.badRequest, word: type + NO_PARAMETER});

                return;
            }

            if (TYPES[1] === type && RARETY_VALUES.indexOf(lowerCaseParam) === -1) {
                this.sendResponse(res, {status: STATUS.badRequest, word: type + INVALID_PARAMETER});
            } else if (TYPES[0] === type && DIFFICULTY_VALUES.indexOf(lowerCaseParam) === -1) {
                this.sendResponse(res, {status: STATUS.badRequest, word: type + INVALID_PARAMETER});
            }
        }

        private findDefinitionByDifficulty(difficulty: string, jsonResponse: string): string {
            const lowercaseDifficulty: string = difficulty.toLowerCase();
            const indexOfDefinition: number = DIFFICULTY_VALUES.indexOf(lowercaseDifficulty);
            let definition: string;

            try {
                definition = this.getDefinitionFromJson(indexOfDefinition, jsonResponse);
            } catch (err) {
                definition = this.getDefinitionFromJson(0, jsonResponse);
            }

            return definition;
        }

        private getDefinitionFromJson(index: number, jsonResponse: string): string {
            let definition: string;
            definition = jsonResponse[BODY][0][DEFS][index].substring(DEFINITION_STARTING_INDEX);

            return definition;
        }

        private hasInternalError(res: Response): boolean {
            return res.headersSent;
        }
    }
}
export = Route;
