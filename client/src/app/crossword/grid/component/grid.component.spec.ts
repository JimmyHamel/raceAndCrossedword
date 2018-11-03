/* tslint:disable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GridComponent } from "./grid.component";
import { CommonModule } from "@angular/common";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { InitializeService } from "../initializer.service";
import { GridService } from "../grid.service";
import { InfoService } from "../../info.service";
import { MockObservableService } from "../../mock/mock-observable.service";
import { GameObservableService } from "../../game-observable.service";
import { Router } from "@angular/router";

describe("GridComponent", () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [GridComponent],
      providers: [InfoService, {provide: GameObservableService, useClass: MockObservableService}, GridService, InitializeService, { provide: Router, useValue: mockRouter } ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(GridComponent);

    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
