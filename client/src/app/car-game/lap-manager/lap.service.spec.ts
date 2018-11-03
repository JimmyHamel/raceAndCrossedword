/* tslint:disable */
import { TestBed } from "@angular/core/testing";
import { LapService } from "./lap.service";
import { GameScene } from "../scenes/game-scene";
import { AppModule } from "../../app.module";
import { Router } from "@angular/router";
import { HighscoreService } from "../end-game/highscore.service";
import { EndGameService } from "../end-game/end-game.service";
import { Car } from "../car/car";
import { Path } from "../track-editor/path";
import { Line, Geometry, Vector3, LineBasicMaterial } from "three";
import { Point } from "../track-editor/point";
import { MockHighscoreService } from "../end-game/mock-highscore.service";
import { END_GAME_URL } from "../../../../../common/communication/communication-url";
import { Checkpoint } from "./checkpoint";

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

describe("LapService", () => {

    let lapService: LapService;
    let mockRouter: MockRouter;
    let scene: GameScene;

    beforeEach(async (done: () => void) => {
        mockRouter = new MockRouter();
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ],
            providers: [
                LapService,
                { provide: Router, useValue: mockRouter },
                { provide: HighscoreService, useClass: MockHighscoreService },
                EndGameService,
            ]

        });

        lapService = TestBed.get(LapService);
        let points: Point[] = [new Point(0, 0, true), new Point(0, 1, false), new Point(1, 1, false)];
        let path = new Path(0, 0, points);

        lapService.path = path;
        let cars: Car[] = [new Car(), new Car(), new Car(), new Car()];
        for (let car of cars) {
            await car.init();
        }
        lapService.cars = cars;

        let checkPoints = new Checkpoint(path.points[0]);
        let checkPoint: Checkpoint = checkPoints;
        for (const point of path.points) {
            if (point !== checkPoint.point) {
                checkPoint.next = new Checkpoint(point);
                checkPoint.next.previous = checkPoint;
                checkPoint = checkPoint.next;
            }
        }
        checkPoint.next = checkPoints;
        checkPoints.previous = checkPoint;

        lapService.checkpoints = checkPoints;
        let material = new LineBasicMaterial({
            color: 0x0000ff
        });

        let geometry = new Geometry();
        geometry.vertices.push(
            new Vector3(-10, 0, 0),
            new Vector3(0, 0, 0),
            new Vector3(10, 0, 0)
        );
        let line = new Line(geometry, material);
        lapService.initManagers(line);
        scene = new GameScene(lapService);
        done();
    });

    it("should stop the game after 3 laps of the human", () => {
        lapService.lapManagers[0]["_currentlap"] = 4;
        lapService["update"](scene);
        expect(mockRouter.navigate).toHaveBeenCalledWith([END_GAME_URL]);

    });

    
});
