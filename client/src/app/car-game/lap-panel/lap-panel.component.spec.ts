/* tslint:disable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LapPanelComponent } from "./lap-panel.component";
import { LapService } from "../lap-manager/lap.service";
import { Router } from "@angular/router";
import { HighscoreService } from "../end-game/highscore.service";
import { MockHighscoreService } from "../end-game/mock-highscore.service";
import { EndGameService } from "../end-game/end-game.service";

class MockRouter {
  public navigate = jasmine.createSpy("navigate");
}

describe("LapPanelComponent", () => {
  let component: LapPanelComponent;
  let fixture: ComponentFixture<LapPanelComponent>;
  let mockRouter: MockRouter;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LapPanelComponent ],
      providers: [ LapService,
                   { provide: Router, useValue: mockRouter },
                   { provide: HighscoreService, useClass: MockHighscoreService },
                   EndGameService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LapPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
