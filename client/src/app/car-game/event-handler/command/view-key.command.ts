import { C_KEYCODE } from "../keycodes";
import { Command } from "../command";
import { CustomScene } from "../../scenes/custom-scene";
import { GameScene } from "../../scenes/game-scene";

export class ViewKeyCommand extends Command {
    public readonly keyCode: number = C_KEYCODE;
    public constructor(scene: CustomScene) {
        super(scene);
    }
    public keyUpGame(): void {
        if (this.scene instanceof GameScene) {
            this.scene.changeView();
        }
    }
}
