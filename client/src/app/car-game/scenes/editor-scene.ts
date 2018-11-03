import { Scene, AmbientLight, Vector2, Vector3, Line } from "three";
import { CameraContainer } from "../camera-container/camera-container";
import { CustomScene } from "./custom-scene";
import { PathHandler } from "../track-editor/path-handler";
import { Point } from "../track-editor/point";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { WHITE } from "../constants";

const CLIENT_CONTAINER_RATIO: number = 2;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const EDITOR_VERTICAL_BOUND: number = 200;
const EDITOR_VERTICAL_OFFSET: number = 50;
const TRACK_IS_COMPLETED: boolean = true;

export class EditorScene extends CustomScene {
    private _trackCompletedObserver: Subject<boolean>;
    private pathHandler: PathHandler;

    public constructor() {
        super();
        this._trackCompletedObserver = new Subject();
        this._trackCompletedObserver.next(!TRACK_IS_COMPLETED);
    }

    public async initialize(aspectRatio: number, container: HTMLDivElement): Promise<void> {
        this.container = container;
        this._cameraContainer = new CameraContainer(aspectRatio, EDITOR_VERTICAL_BOUND);
        this._scene.add(this._cameraContainer);

        this._scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this.pathHandler = new PathHandler(this._scene, this._cameraContainer);
        this._cameraContainer.updateCamera(new Vector3(), this.perspectiveCameraIsActive);
    }

    private calculateMousePosition(mouse: MouseEvent): Vector2 {
        const mouseVector: Vector2 = new Vector2();
        mouseVector.x = (mouse.clientX / this.container.clientWidth) * CLIENT_CONTAINER_RATIO - 1;
        mouseVector.y = -((mouse.clientY - this.container.offsetTop - EDITOR_VERTICAL_OFFSET + window.scrollY)
            / this.container.clientHeight) * CLIENT_CONTAINER_RATIO + 1;

        return mouseVector;
    }

    public update(): void {
        this.pathHandler.updateIllegalList();
    }

    public leftClickDown(mouse: MouseEvent): void {
        this.pathHandler.selectObject(this.calculateMousePosition(mouse));
    }

    public leftClickUp(mouse: MouseEvent): void {
        this._trackCompletedObserver.next(this.pathHandler.deselectObject(this.calculateMousePosition(mouse)));
    }

    public rightClick(): void {
        this._trackCompletedObserver.next(this.pathHandler.removeLastPoint());
    }

    public mouseMove(mouse: MouseEvent): void {
        this.pathHandler.movePoint(this.calculateMousePosition(mouse));
    }

    public save(): Point[] {
        return this.pathHandler.points;
    }
    public loadTrack(listOfPoints: Point[]): void {
        this.pathHandler.loadPath(listOfPoints);
        this._trackCompletedObserver.next(TRACK_IS_COMPLETED);
    }

    public get illegalLinesObserver(): Observable<Line[]> {
        return this.pathHandler.illegalLinesObserver;
    }

    public get trackCompletedObserver(): Observable<boolean> {
        return this._trackCompletedObserver.asObservable();
    }

    public get scene(): Scene {
        return this._scene;
    }
}
