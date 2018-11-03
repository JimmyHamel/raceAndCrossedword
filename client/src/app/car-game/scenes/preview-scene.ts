import { CustomScene } from "./custom-scene";
import { CameraContainer, } from "../camera-container/camera-container";
import { Point } from "../track-editor/point";
import { SceneLight } from "./scene-light";
import { Path } from "../track-editor/path";
import { Offroad } from "../render-service/offroad";
import { StartingZone } from "../starting-zone/starting-zone";

const PERSPECTIVE_CAMERA_IS_ACTIVE: boolean = true;

export class PreviewScene extends CustomScene {
    private startingZone: StartingZone;
    private path: Path;

    public constructor() {
        super();
    }

    public update(deltaTime: number): void {
        if (this.startingZone) {
            this.cameraContainer.updateCamera(this.startingZone.center, !PERSPECTIVE_CAMERA_IS_ACTIVE);
        }
    }

    public async initialize(aspectRatio: number, container: HTMLDivElement, points?: Point[]): Promise<void> {
        this.container = container;
        this._cameraContainer = new CameraContainer(aspectRatio);
        this.cameraContainer.setCameraForPreview();

        this._scene.add(this._cameraContainer);
        this._scene.add(new SceneLight());
    }

    public loadTrack(listOfPoints: Point[], type?: string): void {
        this.actualizePath(listOfPoints);
        this._scene.add(new Offroad());
        this.actualizeStartingZone(listOfPoints);
    }

    private actualizePath(listOfPoints: Point[]): void {
        this._scene.remove(this.path);
        this.path = new Path(0, 0, listOfPoints);
        this.path.addCircles();
        this.path.removePoints();
        this.path.removeLines();
        this.path.updateMatrixWorld(true);
        this._scene.add(this.path);
    }

    private actualizeStartingZone(listOfPoints: Point[]): void {
        if (this.startingZone) {
            this.scene.remove(this.startingZone);
        }
        this.startingZone = new StartingZone(listOfPoints);
        this._scene.add(this.startingZone);
    }

}
