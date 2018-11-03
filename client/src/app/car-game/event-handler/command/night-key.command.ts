import { N_KEYCODE } from "../keycodes";
import { Command } from "../command";
import { GameScene } from "../../scenes/game-scene";
import { CustomScene } from "../../scenes/custom-scene";

export class NightKeyCommand extends Command {
    public readonly keyCode: number = N_KEYCODE;
    public constructor( scene: CustomScene ) {
        super(scene);
    }
    public keyUpGame(): void {
        (this.scene as GameScene).changeTime();
    }
}
