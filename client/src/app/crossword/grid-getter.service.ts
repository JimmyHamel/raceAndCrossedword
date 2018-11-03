import { WordInterface, Difficulty } from "../../../../common/interface/word-interface";
import { BASE_SERVER_URL,
        DIFFICULTY_URL,
        EASY_URL,
        HARD_URL,
        GRID_SERVICE_URL,
        MEDIUM_URL,
        GET_GRID_URL} from "../../../../common/communication/communication-url";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class GridGetterService {

    private _gridUrl: string;

    public constructor(private http: HttpClient) {
        this._gridUrl = "";
    }

    public async getGrid(difficulty: Difficulty): Promise<WordInterface[]> {
        this.buildDifficultyUrl(difficulty);

        return this.http.get<WordInterface[]>(this._gridUrl).toPromise();
    }

    private buildDifficultyUrl(difficulty: Difficulty): void {
        this._gridUrl = BASE_SERVER_URL + GRID_SERVICE_URL + GET_GRID_URL + DIFFICULTY_URL;
        if (difficulty === Difficulty.easy) {
            this._gridUrl += EASY_URL;
        } else if (difficulty === Difficulty.medium) {
            this._gridUrl += MEDIUM_URL;
        } else if (difficulty === Difficulty.hard) {
            this._gridUrl += HARD_URL;
        }
    }
}
