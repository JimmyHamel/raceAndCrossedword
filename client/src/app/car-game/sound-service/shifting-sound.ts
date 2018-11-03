import { Sound } from "./sound";
import { ASSET_FOLDER, CAR_SOUND_FOLDER, SHIFTING_SOUND, MP3_EXTENSION } from "../constants";

const audioFilePath: string = ASSET_FOLDER + CAR_SOUND_FOLDER + SHIFTING_SOUND + MP3_EXTENSION;

export class ShiftingSound extends Sound {

    public constructor() {
        super();
        this.loadSound(audioFilePath, false);
    }

    public ajustVolume(volume: number): void {
        this.audio.setVolume(volume);
    }
}
