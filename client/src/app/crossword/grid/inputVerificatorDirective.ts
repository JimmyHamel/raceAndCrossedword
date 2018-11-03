import { Directive, HostListener, ElementRef, Output, EventEmitter } from "@angular/core";
import { NO_CONTENT } from "./constant";

@Directive({ selector: "[appInputVerificatorDirective]" })
export class InputVerificatorDirective {

    @Output() public emitter: EventEmitter<string> = new EventEmitter();

    private element: HTMLInputElement;

    public constructor(private elementRef: ElementRef) {
        this.element = this.elementRef.nativeElement;
    }

    @HostListener("keydown", ["$event"])
    public onFocus(event: KeyboardEvent): void {
        if (!this.isAllowedCharacter(event.key)) {
            event.preventDefault();

            return;
        }
        this.element.value = event.key.replace(/[^a-zA-Z]/, NO_CONTENT);
        this.emitter.emit(this.element.value);
    }

    private isAllowedCharacter(key: string): boolean {
        if (key.length <= 1) {
            if (key === key.replace(/[^a-zA-Z]/, NO_CONTENT)) {
                return true;
            }
        }

        return false;
    }
}
