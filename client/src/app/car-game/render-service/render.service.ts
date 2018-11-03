import { Injectable } from "@angular/core";
import { WebGLRenderer, Line } from "three";
import { CustomScene } from "../scenes/custom-scene";
import { EditorScene } from "../scenes/editor-scene";
import { GameScene } from "../scenes/game-scene";
import { CommandManager } from "../event-handler/command-manager";
import { Point } from "../track-editor/point";
import { SaveablePoint } from "../../../../../common/interface/saveable-point-interface";
import { LapService } from "../lap-manager/lap.service";
import { Observable } from "rxjs/Observable";
import { PreviewScene } from "../scenes/preview-scene";

@Injectable()
export class RenderService {
    private container: HTMLDivElement;
    private renderer: WebGLRenderer;
    private lastDate: number;
    private _scene: CustomScene;
    private strategyManager: CommandManager;

    public constructor(private lapService: LapService) { }

    public async initialize(container: HTMLDivElement, isEditor: boolean, isPreview: boolean): Promise<void> {
        if (container) {
            this.container = container;
        }
        await this.setScene(isEditor, isPreview);
        this.strategyManager = new CommandManager(this._scene);
        this.startRenderingLoop();
    }
    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this._scene.update(timeSinceLastFrame);
        this.lastDate = Date.now();
    }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    private startRenderingLoop(): void {
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);

        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();
        this._scene.render(this.renderer);
    }
    public onResize(): void {
        this._scene.resize(this.getAspectRatio());
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public onMouseUp(event: MouseEvent): void {
        if (this.strategyManager) {
            this.strategyManager.executeMouseUpCommand(event);
        }
    }

    public onMouseDown(event: MouseEvent): void {
        if (this.strategyManager) {
            this.strategyManager.executeMouseDownCommand(event);
        }
    }

    public onMouseMove(event: MouseEvent): void {
        if (this.strategyManager) {
            this.strategyManager.executeMouseMoveCommand(event);
        }
    }

    private async setScene(isEditorScene: boolean, isPreview: boolean): Promise<void> {
        if (isEditorScene) {
            this._scene = new EditorScene();
            await this._scene.initialize(this.getAspectRatio(), this.container);
        } else if (isPreview) {
            this._scene = new PreviewScene();
            await this._scene.initialize(this.getAspectRatio(), this.container);
        } else {
            this._scene = new GameScene(this.lapService);
            await this._scene.initialize(this.getAspectRatio(), this.container);
        }
    }

    public handleKeyUp(event: KeyboardEvent): void {
        if (this.strategyManager) {
            this.strategyManager.executeKeyUpCommand(event);
        }
    }

    public handleKeyDown(event: KeyboardEvent): void {
        if (this.strategyManager) {
            this.strategyManager.executeKeyDownCommand(event);
        }
    }

    public saveTrack(): Point[] {
        return (this._scene as EditorScene).save();
    }

    public loadTrack(saveablePoints: SaveablePoint[], type?: string): void {
        const points: Point[] = [];
        for (const point of saveablePoints) {
            points.push(new Point(point.x, point.z));
        }
        this._scene.loadTrack(points, type);
    }

    public updateCountdownState(isCountdownOver: boolean): void {
        if (this._scene instanceof GameScene) {
            (this._scene as GameScene).isPlayable = isCountdownOver;
        }
    }
    public get illegalLinesObserver(): Observable<Line[]> {
        return (this._scene as EditorScene).illegalLinesObserver;
    }

    public get trackCompletedObserver(): Observable<boolean> {
        return (this._scene as EditorScene).trackCompletedObserver;
    }

    public get scene(): CustomScene {
        return this._scene;
    }
}
