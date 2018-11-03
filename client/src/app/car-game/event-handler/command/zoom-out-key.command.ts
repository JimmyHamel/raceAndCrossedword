import { MINUS_KEYCODE } from "../keycodes";
import { Command } from "../command";
import { CustomScene } from "../../scenes/custom-scene";
import { GameScene } from "../../scenes/game-scene";

export class ZoomOutKeyCommand extends Command {
    public readonly keyCode: number = MINUS_KEYCODE;
    public constructor(scene: CustomScene) {
        super(scene);
    }
    public keyUpGame(): void {
        (this.scene as GameScene).cameraContainer.zoomOutIsPressed = false;
    }
    public keyDownGame(): void {
        (this.scene as GameScene).cameraContainer.zoomOutIsPressed = true;
    }
}
