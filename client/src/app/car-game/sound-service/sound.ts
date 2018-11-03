import { AudioListener, PositionalAudio, AudioBuffer, AudioLoader } from "three";
import { SOUND_REFERENCE_DISTANCE } from "../constants";
import { SoundError } from "./sound-error";

export abstract class Sound {

    private _soundListener: AudioListener;
    private _audio: PositionalAudio;
    private _audioLoader: AudioLoader;

    public constructor() {
        this._soundListener = new AudioListener();
        this._audio = new PositionalAudio(this._soundListener);
        this._audioLoader = new AudioLoader();
    }

    public loadSound(path: string, shouldLoop: boolean): void {
        this._audioLoader.load(path, (audioBuffer: AudioBuffer) => {
            this._audio.setBuffer(audioBuffer);
            this._audio.setRefDistance(SOUND_REFERENCE_DISTANCE);
            this._audio.setLoop(shouldLoop);
        },                     () => {/* do nothing */}, (error: string) => { throw new SoundError(error); });
    }

    public abstract ajustVolume(speed: number): void;

    public play(): void {
        if (!this._audio.isPlaying) {
            this._audio.play();
        }
    }

    public stop(): void {
        if (this._audio) {
            this._audio.pause();
        }
    }

    public get audio(): PositionalAudio {
        return this._audio;
    }

    public get soundListener(): AudioListener {
        return this._soundListener;
    }
}
