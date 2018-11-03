import { Injectable } from "@angular/core";
import { Highscore } from "../../../../../common/interface/highscore-interface";

const HIGHSCORE: Highscore[] = [
    { time: 10000, by: "1" },
    { time: 11000, by: "2" },
    { time: 12000, by: "3" },
    { time: 13000, by: "4" },
    { time: 14000, by: "5" }];
const BAD_STATUS: number = 200;

@Injectable()
export class MockHighscoreService {

    public oldHighScore: number;
    public newTime: number;
    private highscore: Highscore[];
    public constructor() {
        this.oldHighScore = 0;
        this.newTime = 0;
        this.highscore = HIGHSCORE;
    }
    public updateScores(time: number): void {
        this.newTime = time;
    }

    public updateHighScores(name: string): void {

        const newScore: Highscore = { time: this.newTime, by: name };

        this.getHighScores().push(newScore);
        this.getHighScores().sort((h1: Highscore, h2: Highscore) => h1.time - h2.time);
        this.getHighScores().pop();

        this.pushNewHighScore();
    }
    private pushNewHighScore(): number {
        return BAD_STATUS;
      }
    public getHighScores(): Highscore[] {
        return this.highscore;
    }
}
