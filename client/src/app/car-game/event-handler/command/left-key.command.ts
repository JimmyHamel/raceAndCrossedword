import { A_KEYCODE } from "../keycodes";
import { CustomScene } from "../../scenes/custom-scene";
import { GameScene } from "../../scenes/game-scene";
import { Command } from "../command";

export class LeftKeyCommand extends Command {
    public readonly keyCode: number;
    public constructor( scene: CustomScene ) {
        super(scene);
        this.keyCode = A_KEYCODE;
    }
    public keyUpGame(): void {
        (this.scene as GameScene).car.releaseSteering();
    }
    public keyDownGame(): void {
        (this.scene as GameScene).car.steerLeft();
    }
}
