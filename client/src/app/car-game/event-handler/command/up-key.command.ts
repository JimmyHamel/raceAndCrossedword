import { W_KEYCODE } from "../keycodes";
import { CustomScene } from "../../scenes/custom-scene";
import { GameScene } from "../../scenes/game-scene";
import { Command } from "../command";

export class UpKeyCommand extends Command {
    public readonly keyCode: number = W_KEYCODE;
    public constructor( scene: CustomScene ) {
        super(scene);
    }
    public keyUpGame(): void {
        (this.scene as GameScene).car.releaseAcceleration();
    }
    public keyDownGame(): void {
        (this.scene as GameScene).car.accelerate();
    }
}
