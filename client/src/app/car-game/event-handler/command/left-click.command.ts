import { LEFT_CLICK_KEYCODE } from "../keycodes";
import { CustomScene } from "../../scenes/custom-scene";
import { EditorScene } from "../../scenes/editor-scene";
import { Command } from "../command";

export class LeftClickCommand extends Command {
    public readonly keyCode: number = LEFT_CLICK_KEYCODE;
    public constructor( scene: CustomScene ) {
        super(scene);
    }
    public keyUpEditor(mouse?: MouseEvent): void {
        (this.scene as EditorScene).leftClickUp(mouse);
    }
    public keyDownEditor(mouse?: MouseEvent ): void {
        (this.scene as EditorScene).leftClickDown(mouse);
    }
}
