import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { COUNTDOWN_SOUND_VOLUME, ASSET_FOLDER, STARTING_SOUND, MP3_EXTENSION } from "../constants";

export const COUNTDOWN_INITIAL_VALUE: number = 5;
const SECONDS_IN_MS: number = 1000;
const SOUND_ERROR: string = "Erreur de lecture de son";

@Injectable()
export class TrackCountdownService {
    private _countdownObservable: Subject<number>;
    private _secondsLeft: number;
    private _sound: HTMLAudioElement;
    private _soundPlaying: boolean;
    public constructor() {
        this.resetValues();
        this._countdownObservable = new Subject<number>();
    }

    public initialize(): void {
        this.resetValues();
        this._sound = new Audio(ASSET_FOLDER + STARTING_SOUND + MP3_EXTENSION);
        this._sound.volume = COUNTDOWN_SOUND_VOLUME;
        this._sound.load();
        this.countdown();
    }

    public resetValues(): void {
        this._secondsLeft = COUNTDOWN_INITIAL_VALUE;
        this._soundPlaying = false;
    }

    private countdown(): void {
        const countdown: number = window.setInterval(
            () => {
                this._secondsLeft -= 1;
                this.playSound();
                this._countdownObservable.next(this._secondsLeft);
                if (this._secondsLeft <= 0) {
                    clearInterval(countdown);
                }
            },
            SECONDS_IN_MS);
    }

    public get countdownObservable(): Observable<number> {
        return this._countdownObservable.asObservable();
    }

    private playSound(): void {
        if (!this._soundPlaying) {
            this._sound.play().then(() => this._soundPlaying = true).catch(() => alert(SOUND_ERROR));
        }
    }
}
