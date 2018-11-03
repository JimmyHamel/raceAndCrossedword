/* tslint:disable: no-magic-numbers */
import { InputVerificatorDirective } from "./inputVerificatorDirective";

import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Component, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

@Component({
    template: `<input type="text" appInputVerificatorDirective>`
})
class TestInputComponent {
}

describe("Directive: Input", () => {

    let component: TestInputComponent;
    let fixture: ComponentFixture<TestInputComponent>;
    let inputEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestInputComponent, InputVerificatorDirective]
        });
        fixture = TestBed.createComponent(TestInputComponent);
        component = fixture.componentInstance;
        inputEl = fixture.debugElement.query(By.css("input"));
    });

    it("should place a letter", () => {
        inputEl.triggerEventHandler("keydown", {key: "a"});
        fixture.detectChanges();
        expect(inputEl.nativeElement.value).toBe("a");
    });
    it("should not place a number", () => {
        inputEl.triggerEventHandler("keydown", {key: "0"});
        fixture.detectChanges();
        expect(inputEl.nativeElement.value).toBe("");
    });
    it("should not place a special character", () => {
        inputEl.triggerEventHandler("keydown", {key: "+"});
        fixture.detectChanges();
        expect(inputEl.nativeElement.value).toBe("");
    });
});
