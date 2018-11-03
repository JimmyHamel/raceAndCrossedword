import { Sound } from "./sound";
import {ASSET_FOLDER, MP3_EXTENSION, WALL_COLLISION_SOUND, CAR_SOUND_FOLDER, WALL_COLLISION_SOUND_MAX_SPEED,
        TWENTY_FIVE_PERCENT } from "../constants";

const audioFilePath: string = ASSET_FOLDER + CAR_SOUND_FOLDER + WALL_COLLISION_SOUND + MP3_EXTENSION;

export class WallCollisionSound extends Sound {

    public constructor() {
        super();
        this.loadSound(audioFilePath, false);
    }

    public ajustVolume(speed: number): void {
        this.audio.setVolume(this.calculateVolumeRatio(speed));
    }

    private calculateVolumeRatio(speed: number): number {
        return speed / WALL_COLLISION_SOUND_MAX_SPEED * TWENTY_FIVE_PERCENT;
    }
}
