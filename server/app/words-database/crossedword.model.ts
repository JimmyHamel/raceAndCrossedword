import * as mongoose from "mongoose";
export const MODEL_NAME: string = "asyncCrossedWord";
const COLLECTION_NAME: string = "asyncWords";
export const CROSSED_WORD_SCHEMA: mongoose.Schema = new mongoose.Schema(
    {
    crossedWord: [{
    x: {type: Number},
    y: {type: Number},
    orientation: {type: Number},
    word: {type: String},
    definition: {type: String},
    }],
    difficulty: {type: Number}
    },
    {collection: COLLECTION_NAME});
export default mongoose.model(MODEL_NAME, CROSSED_WORD_SCHEMA);
