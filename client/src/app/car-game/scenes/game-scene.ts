import { Car } from "../car/car";
import { CameraContainer } from "../camera-container/camera-container";
import { CustomScene } from "./custom-scene";
import { Skybox } from "../render-service/skybox";
import { Path } from "../track-editor/path";
import { OffroadHandler } from "../collision/offroad-handler";
import { Point } from "../track-editor/point";
import { StartingZone } from "../starting-zone/starting-zone";
import { CollisionService } from "../collision/collision.service";
import { SceneLight } from "./scene-light";
import { NightManager } from "../render-service/night-manager";

import { NpcCarAI } from "../artificial-intelligence/npc-car-ai";
import { LapService } from "../lap-manager/lap.service";
import { Checkpoint } from "../lap-manager/checkpoint";
import { DEFAULT_DELTATIME, DAY_TRACK_TYPE, TOTAL_LAP_COUNT } from "../constants";
const NUMBER_OF_CARS: number = 4;

export class GameScene extends CustomScene {
    private _cars: Car[];
    private _npcs: NpcCarAI[];
    private _offroadHandler: OffroadHandler;
    private _path: Path;
    private collisionService: CollisionService;
    private _trackIsPlayable: boolean;
    private _startingZone: StartingZone;
    private nightManager: NightManager;
    private checkPoints: Checkpoint;

    public constructor(private lapService: LapService) {
        super();
        this._cars = [];
        this._npcs = [];
        this.createCars();
        this.collisionService = new CollisionService();
    }

    private createCars(): void {
        for (let i: number = 0; i < NUMBER_OF_CARS; i++) {
            this._cars[i] = new Car();
        }
    }

    public async initialize(aspectRatio: number, container: HTMLDivElement, points?: Point[]): Promise<void> {
        this.container = container;
        const skybox: Skybox = new Skybox();
        this.initBasicScene(aspectRatio, skybox);
        await this.addCarsToScene();
        this.initStartingZone();
        const sceneLight: SceneLight = new SceneLight();
        this._scene.add(sceneLight);
        this.collisionService.initialize(this._cars);
        this.initNightElements(sceneLight,  skybox);
    }

    private initBasicScene(aspectRatio: number,  skybox: Skybox ): void {
        this._cameraContainer = new CameraContainer(aspectRatio);
        this._scene.add(this._cameraContainer);
        this._scene.add(skybox);
    }

    private async addCarsToScene(): Promise<void>  {
        for (let i: number = 0; i < NUMBER_OF_CARS; i++) {
            await this._cars[i].init();
            this.cameraContainer.add(this._cars[i].rpmSound.soundListener);
            this.cameraContainer.add(this._cars[i].shiftingSound.soundListener);
            this.cameraContainer.add(this._cars[i].carCollisionSound.soundListener);
            this._scene.add(this._cars[i]);
        }
    }

    private initStartingZone(): void {
        if (this._startingZone) {
            this.setStartPosition();
            this.lapService.initManagers(this._startingZone.startingLine);
            this.updateCars(DEFAULT_DELTATIME);
        }
    }

    private setStartPosition(): void {
        this._startingZone.startingGrid.forEach((player, index) => {
            this._cars[player - 1].meshPosition = this._startingZone.startingPosition[index];
            this._cars[player - 1].angle = this._startingZone.objectRotation;
        });
    }

    private initNightElements(sceneLight: SceneLight,  skybox: Skybox ): void {
        if (this.nightManager) {
            this.nightManager.addElement(this._offroadHandler.offroad);
            this.nightManager.addElement(skybox);
            this.nightManager.addElement(sceneLight);
            for (const car of this._cars) {
                this.nightManager.addElement(car);
            }
            this.nightManager.initElements();
        }
    }

    public update(deltaTime: number): void {
        if (this._trackIsPlayable) {
            this.updateCars(deltaTime);
            this.lapService.update(this);
            this.collisionService.update();
            this._offroadHandler.update();
        } else if (this.lapService.playerManager) {
            if (this.lapService.playerManager.currentlap === TOTAL_LAP_COUNT + 1) {
                this.stopCarsSounds();
            }
        }
        this._cameraContainer.updateCamera(this._cars[0].meshPosition, this.perspectiveCameraIsActive, this._cars[0].meshQuaternion);
    }

    private updateCars(deltaTime: number): void {
        this.car.update(deltaTime);
        for (const npc of this._npcs) {
            npc.update(deltaTime);
        }
    }

    private stopCarsSounds(): void {
        for (const car of this._cars) {
            car.stopSounds();
        }
    }

    public loadTrack(points: Point[], type?: string): void {
        this.actualizeScene(points);
        this.initCheckpoints();
        this.initLapService();
        this.initAI();
        this.nightManager = new NightManager(type === DAY_TRACK_TYPE);
    }

    private actualizeScene(points: Point[]): void {
        this._scene.remove(this._path);
        this.actualizePath(points);
        this._offroadHandler = new OffroadHandler(this, this.lapService);
        this._startingZone = new StartingZone(points);
        this._scene.add(this._path);
        this._scene.add(this._offroadHandler);
        this._scene.add(this._startingZone);
    }

    private actualizePath(points: Point[]): void {
        this._path = new Path(0, 0, points);
        this._path.addCircles();
        this._path.removePoints();
        this._path.removeLines();
        this._path.updateMatrixWorld(true);
    }

    private initLapService(): void {
        this.lapService.cars = this._cars;
        this.lapService.path = this._path;
        this.lapService.checkpoints = this.checkPoints;
    }

    private initCheckpoints(): void {
        this.checkPoints = new Checkpoint(this._path.points[0]);
        let checkPoint: Checkpoint = this.checkPoints;
        for (const point of this._path.points) {
            if (point !== checkPoint.point) {
                checkPoint.next = new Checkpoint(point);
                checkPoint.next.previous = checkPoint;
                checkPoint = checkPoint.next;
            }
        }
        checkPoint.next = this.checkPoints;
        this.checkPoints.previous = checkPoint;
    }

    private initAI(): void {
        for (let i: number = 1; i < this._cars.length; i++) {
            this._npcs[i - 1] = new NpcCarAI(this._cars[i], this.checkPoints);
        }
    }

    public changeTime(): void {
        this.nightManager.changeTime();
    }

    public set isPlayable(isPlayable: boolean) {
        this._trackIsPlayable = isPlayable;
    }

    public get path(): Path {
        return this._path;
    }

    public get cars(): Car[] {
        return this._cars;
    }

    public get car(): Car {
        return this._cars[0];
    }

}
