import { RIGHT_CLICK_KEYCODE } from "../keycodes";
import { CustomScene } from "../../scenes/custom-scene";
import { EditorScene } from "../../scenes/editor-scene";
import { Command } from "../command";

export class RightClickCommand extends Command {
    public readonly keyCode: number = RIGHT_CLICK_KEYCODE;
    public constructor( scene: CustomScene ) {
        super(scene);
    }
    public keyUpEditor(): void {
        (this.scene as EditorScene).rightClick();
    }
}
