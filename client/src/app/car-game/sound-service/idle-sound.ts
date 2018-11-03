import { Sound } from "./sound";
import { PLAYBACK_RATE_OFFSET, ASSET_FOLDER, CAR_SOUND_FOLDER, MP3_EXTENSION, MAX_SOUND_RPM, IDLE_SOUND } from "../constants";

const audioFilePath: string = ASSET_FOLDER + CAR_SOUND_FOLDER + IDLE_SOUND + MP3_EXTENSION;
export class IdleSound extends Sound {

    public constructor() {
        super();
        this.loadSound(audioFilePath, true);
    }

    public matchRPM(rpm: number): void {
        if (rpm !== 0 ) {
            this.audio.setPlaybackRate(this.calculateRPMRatio(rpm) + PLAYBACK_RATE_OFFSET);
            this.ajustVolume(rpm);
        }
    }

    public ajustVolume(rmp: number): void {
        this.audio.setVolume(this.calculateRPMRatio(rmp));
    }

    private calculateRPMRatio(rpm: number): number {
        return rpm / MAX_SOUND_RPM;
    }
}
