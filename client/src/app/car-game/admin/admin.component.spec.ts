/*tslint:disable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AdminComponent } from "./admin.component";
import { RouterTestingModule } from "@angular/router/testing";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { Track } from "../../../../../common/interface/track";

describe("AdminComponent", () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let location: Location;
  let router: Router;
  const DELAY: number = 50;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: "admin", component: AdminComponent }
        ])
      ],
      declarations: [AdminComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();

    router = TestBed.get(Router);
    location = TestBed.get(Location);
    router.initialNavigation();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("navigate to \"/admin\" should work", fakeAsync(() => {
    router.navigate(["/admin"]);
    tick(DELAY);
    expect(location.path()).toBe("/admin");
  }));

  it("creates a track with a custom name", (() => {
    const track: Track = {
      name: "newName",
      description: "newDescription",
      points: [],
      highscores: [],
      type: "Jour",
      playedCount: 0,
      _id: ""
    };
    expect(track.name).toEqual("newName");
  }));

  it("creates a track with a custom description", (() => {
    const track: Track = {
      name: "newName",
      description: "newDescription",
      points: [],
      highscores: [],
      type: "Jour",
      playedCount: 0,
      _id: ""
    };
    expect(track.description).toEqual("newDescription");
  }));
});
