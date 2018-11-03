import * as mongoose from "mongoose";
export const MODEL_NAME: string = "trackModel";
const COLLECTION_NAME: string = "tracks";

export const TRACK_SCHEMA: mongoose.Schema = new mongoose.Schema(
    {
        name: String,
        description: String,

        points: {
            type : Array,
            x: Number,
            z: Number,
            _id : false,
        },
        highscores: {
            type: Array,
            time: Number,
            by: String,
            default: [{time: 999999, by: "Labine" }, {time: 999999, by: "Max-Mathieu" },
                      {time: 999999, by: "Cedyk" }, {time: 999999, by: "Jimmy" },
                      {time: 999999, by: "Sylvestre" }]
        },
        type: {type: String, default: "jour"},
        playedCount: {
            type: Number,
            default: 0
        }
    },
    {
    collection: COLLECTION_NAME
});
export default mongoose.model(MODEL_NAME, TRACK_SCHEMA);
