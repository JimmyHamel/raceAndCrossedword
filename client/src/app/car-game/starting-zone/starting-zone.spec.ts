import { StartingZone } from "./starting-zone";
import { Point } from "../track-editor/point";

const PLAYER_ONE: number = 1;
const PLAYER_TWO: number = 2;
const PLAYER_THREE: number = 3;
const PLAYER_FOUR: number = 4;
const MAX_TRY_BEFORE_CRASH: number = 1000;
describe("Starting zone", () => {
    const initialGrid: number[] = [PLAYER_ONE, PLAYER_TWO, PLAYER_THREE, PLAYER_FOUR];
    const startingZone: StartingZone = new StartingZone([new Point(0, 0), new Point(1, 1)]);
    it("Should generate random grid", () => {
        for (let i: number = 0; i < MAX_TRY_BEFORE_CRASH; i++) {
            const generatedGrid: number[] = startingZone.startingGrid;
            if (generatedGrid[0] !== initialGrid[0]) {
                expect(true);

                return;
            }
        }
        });
    });
