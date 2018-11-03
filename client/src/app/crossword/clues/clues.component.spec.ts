/*tslint:disable*/
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CommonModule } from "@angular/common";

import { CluesComponent } from "./clues.component";
import { InfoService } from "../info.service";
import { GameObservableService } from "../game-observable.service";
import { MessengerService } from "../messenger.service";
import { Router } from "@angular/router";

describe("CwCluesComponent", () => {

let comp: CluesComponent;
let fixture: ComponentFixture<CluesComponent>;
const mockRouter = {
  navigate: jasmine.createSpy('navigate')
}
beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ CommonModule ],
      declarations: [ CluesComponent],
      providers: [InfoService, GameObservableService, MessengerService, { provide: Router, useValue: mockRouter }],
    });
    fixture = TestBed.createComponent(CluesComponent);

    comp = fixture.componentInstance; // AppComponent test instance
  });

it("should create", () => {
    expect(comp).toBeTruthy();
  });
});
