import { S_KEYCODE } from "../keycodes";
import { CustomScene } from "../../scenes/custom-scene";
import { GameScene } from "../../scenes/game-scene";
import { Command } from "../command";

export class DownKeyCommand extends Command {
    public readonly keyCode: number = S_KEYCODE;
    public constructor( scene: CustomScene ) {
        super(scene);
    }
    public keyUpGame(): void {
        (this.scene as GameScene).car.releaseBrakes();
    }
    public keyDownGame(): void {
        (this.scene as GameScene).car.brake();
    }
}
