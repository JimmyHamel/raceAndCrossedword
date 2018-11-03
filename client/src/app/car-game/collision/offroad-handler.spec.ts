import { OffroadHandler } from "./offroad-handler";
import { GameScene } from "../scenes/game-scene";
import { LapService } from "../lap-manager/lap.service";
import { TestBed } from "@angular/core/testing";
import { Path } from "../track-editor/path";
import { Point } from "../track-editor/point";

/* tslint:disable */

describe("Offroad Handler", () => {
  let offroadHandler: OffroadHandler;
  let lapService: LapService;
  let mockPoints: Point[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [lapService]
    });
    const scene: GameScene = new GameScene(lapService);
    mockPoints = [new Point(0,0),new Point(80,0),new Point(40,40)]
    scene["_path"]= new Path(0,0, mockPoints);
    offroadHandler = new OffroadHandler(scene, lapService);
  });

  it("should be created", () => {
    expect(offroadHandler).toBeTruthy();
  });
});
