/*tslint:disable*/
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { ResultScreenComponent } from "./result-screen.component";
import { GridService } from "../grid/grid.service";
import { InfoService } from "../info.service";
import { PlayerService } from "../player.service";
import { MessengerService } from "../messenger.service";
import { GameObservableService } from "../game-observable.service";
import * as Url from "../../../../../common/communication/communication-url";

describe("ResultScreenComponent", () => {
  let component: ResultScreenComponent;
  let fixture: ComponentFixture<ResultScreenComponent>;
  let infoService:InfoService;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultScreenComponent ],
      providers: [ MessengerService, InfoService, PlayerService, { provide: Router, useValue: mockRouter }, GridService, GameObservableService ]
    })
    .compileComponents();
    infoService = TestBed.get(InfoService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should start a new singleplayer game", ()=>{
    infoService.gridDifficulty = "0";
    component["replay"]();
    expect(mockRouter.navigate).toHaveBeenCalledWith([Url.HOME_URL + Url.CROSSWORD_BOARD_URL + Url.GameMode.singleplayer +"0"]);
  });

  it("should start a new multiplayer game if both agree", ()=>{
    infoService.gridDifficulty = "0";
    infoService.replay = [true, true];
    component["replayMultiplayer"]();
    expect(mockRouter.navigate).toHaveBeenCalledWith([Url.HOME_URL + Url.CROSSWORD_BOARD_URL + Url.GameMode.multiplayer + Url.LOADING_GAME_URL]);
  });

  it("should not start a new multiplayer game", ()=>{
    mockRouter.navigate.calls.reset();
    infoService.gridDifficulty = "0";
    infoService.replay = [true, false];
    component["replayMultiplayer"]();
    expect(mockRouter.navigate.calls.count()).toBe(0);
  });
});
