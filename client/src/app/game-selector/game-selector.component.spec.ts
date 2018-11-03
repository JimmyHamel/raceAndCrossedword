import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameSelectorComponent } from "./game-selector.component";
import { RouterTestingModule } from "@angular/router/testing";

describe("GameSelectorComponent", () => {
  let component: GameSelectorComponent;
  let fixture: ComponentFixture<GameSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ RouterTestingModule ],
        declarations: [ GameSelectorComponent ]
    })
    .compileComponents().catch();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
