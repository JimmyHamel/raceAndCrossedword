import { Scene, WebGLRenderer } from "three";
import { CameraContainer, } from "../camera-container/camera-container";
import { Point } from "../track-editor/point";

export abstract class CustomScene {
    protected _scene: Scene;
    protected _cameraContainer: CameraContainer;
    protected container: HTMLDivElement;
    protected perspectiveCameraIsActive: boolean;

    public constructor() {
        this._scene = new Scene();
        this.perspectiveCameraIsActive = false;
    }

    public abstract update(deltaTime: number): void;
    public abstract async initialize(aspectRatio: number, container: HTMLDivElement, points?: Point[]): Promise<void>;
    public abstract loadTrack(listOfPoints: Point[], type?: string): void;

    public render(renderer: WebGLRenderer): void {
        if (this.perspectiveCameraIsActive) {
            renderer.render(this._scene, this._cameraContainer.perspectiveCamera);
        } else {
            renderer.render(this._scene, this._cameraContainer.orthographicCamera);
        }
    }

    public changeView(): void {
        this.perspectiveCameraIsActive = !this.perspectiveCameraIsActive;
    }

    public resize(aspectRatio: number): void {
        this._cameraContainer.resize(aspectRatio);
    }

    public get scene(): Scene {
        return this._scene;
    }

    public get cameraContainer(): CameraContainer {
        return this._cameraContainer;
    }
}
