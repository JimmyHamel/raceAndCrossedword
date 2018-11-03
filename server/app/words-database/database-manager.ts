import * as mongoose from "mongoose";
import { CrossedWord } from "../grid-service/crossedword";
import CrossedWordModel, { MODEL_NAME, } from "./crossedword.model";
import { WordInterface, Difficulty } from "../../../common/interface/word-interface";
import { URL_BD } from "../../../common/communication/communication-url";
import { DBConnectionError } from "./db-connection-error";
import { SaveWordsError } from "./save-words-error";
import { FindWordsError } from "./find-words-error";

export class DBManager {

    public  constructor () {
        this.connectToDB().catch((err: DBConnectionError) => { console.error(err); });
    }
    public  async  connectToDB(): Promise<void> {
        await mongoose.connect(URL_BD).catch((err: string) => new DBConnectionError(err));
    }
    public  async addCrosswords(crossedword: CrossedWord): Promise<void> {
        await this.addWord(crossedword.words, crossedword.difficulty);
    }
    public  async addWord(word: WordInterface[], crosswordDifficulty: Difficulty): Promise<void> {
        const newCrossedword: mongoose.Document = new CrossedWordModel({crossedWord: word, difficulty: crosswordDifficulty });
        await newCrossedword.save().catch((err: string) => { throw new SaveWordsError(err); });
    }
    public async getWords(requestDifficulty: Difficulty): Promise<mongoose.Document[]> {
        return mongoose.model(MODEL_NAME)
        .find({ difficulty: requestDifficulty }, { _id: 0, "crossedWord._id": 0})
        .catch((err: string) => { throw new FindWordsError(err); });
    }
}
