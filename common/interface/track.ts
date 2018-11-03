import { SaveablePoint } from "./saveable-point-interface";
import { Highscore } from "./highscore-interface";
export interface Track {
    name?: string;
    description?: string;
    points?: SaveablePoint[];
    highscores?: Highscore[];
    type?: string;
    playedCount?: number;
    _id?: string;
}
