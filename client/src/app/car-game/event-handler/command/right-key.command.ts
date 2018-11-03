import { D_KEYCODE } from "../keycodes";
import { CustomScene } from "../../scenes/custom-scene";
import { GameScene } from "../../scenes/game-scene";
import { Command } from "../command";

export class RightKeyCommand extends Command {
    public readonly keyCode: number = D_KEYCODE;
    public constructor( scene: CustomScene ) {
        super(scene);
    }
    public keyUpGame(): void {
        (this.scene as GameScene).car.releaseSteering();
    }
    public keyDownGame(): void {
        (this.scene as GameScene).car.steerRight();
    }
}
