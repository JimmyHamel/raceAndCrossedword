import { Component } from "@angular/core";

const TEAM: string[] =
["Cédryk Doucet",
 "Mathieu Giroux-Huppé",
 "Maxime Gosselin",
 "Jimmy Hamel",
 "Sébastien Labine",
 "Sylvestre Rousseau"];

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent {

  public team: string[];

  public constructor() {
    this.team = TEAM;
  }

}
