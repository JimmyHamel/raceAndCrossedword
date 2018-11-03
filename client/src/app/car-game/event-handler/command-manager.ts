import { CustomScene } from "../scenes/custom-scene";
import { EditorScene } from "../scenes/editor-scene";
import { MOUSE_MOVE_KEYCODE } from "./keycodes";
import { LeftKeyCommand } from "./command/left-key.command";
import { RightKeyCommand } from "./command/right-key.command";
import { DownKeyCommand } from "./command/down-key.command";
import { UpKeyCommand } from "./command/up-key.command";
import { ViewKeyCommand } from "./command/view-key.command";
import { ZoomInKeyCommand } from "./command/zoom-in-key.command";
import { ZoomOutKeyCommand } from "./command/zoom-out-key.command";
import { LeftClickCommand } from "./command/left-click.command";
import { RightClickCommand } from "./command/right-click.command";
import { MouseMoveCommand } from "./command/mouse-move.command";
import { Command } from "./command";
import { NightKeyCommand } from "./command/night-key.command";
import { GameScene } from "../scenes/game-scene";

export class CommandManager {
    private commands: Command[];

    public constructor(private scene: CustomScene) {
        this.initializeCommands();
    }

    private initializeCommands(): void {
        this.commands = [];
        this.createCommand(LeftKeyCommand);
        this.createCommand(RightKeyCommand);
        this.createCommand(UpKeyCommand);
        this.createCommand(DownKeyCommand);
        this.createCommand(ViewKeyCommand);
        this.createCommand(ZoomInKeyCommand);
        this.createCommand(ZoomOutKeyCommand);
        this.createCommand(LeftClickCommand);
        this.createCommand(RightClickCommand);
        this.createCommand(MouseMoveCommand);
        this.createCommand(NightKeyCommand);
    }

    private createCommand<T extends Command>(command: new (scene: CustomScene) => T): void {
        this.commands.push(new command(this.scene));
    }

    public executeKeyUpCommand(event: KeyboardEvent): void {
        if (this.findCommand(event.keyCode) !== null) {
            if (this.scene instanceof EditorScene) {
                this.findCommand(event.keyCode).keyUpEditor();
            } else if (this.scene instanceof GameScene) {
                this.findCommand(event.keyCode).keyUpGame();
            }
        }
    }

    public executeKeyDownCommand(event: KeyboardEvent): void {
        if (this.findCommand(event.keyCode) !== null) {
            if (this.scene instanceof EditorScene) {
                this.findCommand(event.keyCode).keyDownEditor();
            } else if (this.scene instanceof GameScene) {
                this.findCommand(event.keyCode).keyDownGame();
            }
        }
    }

    public executeMouseUpCommand(event: MouseEvent): void {
        if (this.findCommand(event.button) !== null) {
            if (this.scene instanceof EditorScene) {
                this.findCommand(event.button).keyUpEditor(event);
            } else if (this.scene instanceof GameScene) {
                this.findCommand(event.button).keyUpGame();
            }
        }
    }

    public executeMouseDownCommand(event: MouseEvent): void {
        if (this.findCommand(event.button) !== null) {
            if (this.scene instanceof EditorScene) {
                this.findCommand(event.button).keyDownEditor(event);
            } else if (this.scene instanceof GameScene) {
                this.findCommand(event.button).keyDownGame();
            }
        }
    }

    public executeMouseMoveCommand(event: MouseEvent): void {
        if (this.findCommand(MOUSE_MOVE_KEYCODE) !== null) {
            if (this.scene instanceof EditorScene) {
                this.findCommand(MOUSE_MOVE_KEYCODE).mouseMoveEditor(event);
            }
        }
    }

    private findCommand(key: number): Command {
        let foundCommand: Command = null;
        for (const command of this.commands) {
            if (command.keyCode === key) {
                foundCommand = command;
                break;
            }
        }

        return foundCommand;
    }
}
