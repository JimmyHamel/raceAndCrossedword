import { MOUSE_MOVE_KEYCODE } from "../keycodes";
import { CustomScene } from "../../scenes/custom-scene";
import { EditorScene } from "../../scenes/editor-scene";
import { Command } from "../command";

export class MouseMoveCommand extends Command {
    public readonly keyCode: number = MOUSE_MOVE_KEYCODE;
    public constructor( scene: CustomScene ) {
        super(scene);
    }
    public mouseMoveEditor(mouse?: MouseEvent): void {
        (this.scene as EditorScene).mouseMove(mouse);
    }
}
