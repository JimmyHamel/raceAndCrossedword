import { CustomScene } from "../scenes/custom-scene";

export abstract class Command {
    public readonly keyCode: number;
    public constructor( protected scene: CustomScene ) {}
    public keyUpGame(): void {}
    public keyDownGame(): void {}
    public keyUpEditor( mouse?: MouseEvent ): void {}
    public keyDownEditor( mouse?: MouseEvent ): void {}
    public mouseMoveEditor(mouse?: MouseEvent): void {}
}
