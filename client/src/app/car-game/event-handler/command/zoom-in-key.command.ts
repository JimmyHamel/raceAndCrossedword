import { PLUS_KEYCODE } from "../keycodes";
import { Command } from "../command";
import { CustomScene } from "../../scenes/custom-scene";
import { GameScene } from "../../scenes/game-scene";

export class ZoomInKeyCommand extends Command {
    public readonly keyCode: number = PLUS_KEYCODE;
    public constructor(scene: CustomScene) {
        super(scene);
    }
    public keyUpGame(): void {
        (this.scene as GameScene).cameraContainer.zoomInIsPressed = false;
    }
    public keyDownGame(): void {
        (this.scene as GameScene).cameraContainer.zoomInIsPressed = true;
    }

}
