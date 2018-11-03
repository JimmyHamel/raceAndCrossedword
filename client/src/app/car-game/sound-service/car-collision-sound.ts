import { Sound } from "./sound";
import {CAR_COLLISION_SOUND, MP3_EXTENSION, CAR_SOUND_FOLDER, ASSET_FOLDER,
        CAR_COLLISION_SOUND_MAX_SPEED, TWENTY_FIVE_PERCENT } from "../constants";
const audioFilePath: string = ASSET_FOLDER + CAR_SOUND_FOLDER + CAR_COLLISION_SOUND + MP3_EXTENSION;
export class CarCollisionSound extends Sound {

    public constructor() {
        super();
        this.loadSound(audioFilePath, false);
    }

    public ajustVolume(speed: number): void {
        this.audio.setVolume(this.calculateVolumeRatio(speed));
    }

    private calculateVolumeRatio(speed: number): number {
        return speed / CAR_COLLISION_SOUND_MAX_SPEED * TWENTY_FIVE_PERCENT;
    }
}
