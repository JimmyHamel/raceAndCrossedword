import { Directive, HostListener } from "@angular/core";
import { RenderService } from "../../render-service/render.service";

@Directive({
  selector: "[appEditorDirective]"
})
export class EditorcomponentDirective {

  public constructor(private renderService: RenderService) {}

  @HostListener("mouseup", ["$event"])
  public mouseUp( event: MouseEvent ): void {
    this.renderService.onMouseUp(event);
  }

  @HostListener("mousedown", ["$event"])
  public mouseDown( event: MouseEvent ): void {
    this.renderService.onMouseDown(event);
  }

  @HostListener("mousemove", ["$event"])
  public mouseMove( event: MouseEvent ): void {
    this.renderService.onMouseMove(event);
  }

  @HostListener("contextmenu", ["$event"])
  public contextMenu( event: MouseEvent ): boolean {
      return false;
  }

  @HostListener("window:keydown", ["$event"])
  public onKeyDown(event: KeyboardEvent): void {
      this.renderService.handleKeyDown(event);
  }

  @HostListener("window:keyup", ["$event"])
  public onKeyUp(event: KeyboardEvent): void {
      this.renderService.handleKeyUp(event);
  }
}
