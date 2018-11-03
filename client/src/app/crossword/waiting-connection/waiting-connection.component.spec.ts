/* tslint:disable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { WaitingConnectionComponent } from "./waiting-connection.component";

describe("WaitingConnectionComponent", () => {
  let component: WaitingConnectionComponent;
  let fixture: ComponentFixture<WaitingConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
