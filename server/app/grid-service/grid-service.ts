import { Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { CrossedWordsGenerator } from "./crossedwords-generator";
import { CrossedWord } from "./crossedword";
import { DBManager } from "../words-database/database-manager";
import * as mongoose from "mongoose";
import { WordInterface } from "../../../common/interface/word-interface";
import { SaveWordsError } from "../words-database/save-words-error";
import { FindWordsError } from "../words-database/find-words-error";

const DEFAULT_LENGTH: number = 10;

module Route {
    @injectable()
    export class ServiceGrid {
        private dbManager: DBManager;

        public constructor() {
            this.dbManager = new DBManager();
        }
        public generate(difficulty: string, res: Response): void {
            const generator: CrossedWordsGenerator = new CrossedWordsGenerator();

            generator.generateNewCrossedWord(DEFAULT_LENGTH, +difficulty).then((grid: CrossedWord) => {
                this.dbManager.addCrosswords(grid).then(() => res.json(grid.words)).catch((err: string) => err);
            }).catch((err: string) => res.send(new SaveWordsError(err)));
        }
        public getGrid(difficulty: string, res: Response): void {
            this.dbManager.getWords(+difficulty).then((words: mongoose.Document[]) =>
            res.json((words[Math.floor(Math.random() * (words.length - 1))].toJSON().crossedWord as WordInterface[])))
            .catch((err: string) => res.send(new FindWordsError(err)));
        }
    }
}
export = Route;
