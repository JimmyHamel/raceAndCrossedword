import { Component } from "@angular/core";

const CONTROLS: string[] = [
  "W   - Accélérer",
  "A,D - Gauche, Droite",
  "S   - Décélérer",
  "C   - Changement de Caméra",
  "N   - Jour / Nuit ",
  "+/- - Zoom avant / Zoom arriere"
];

@Component({
  selector: "app-controls-panel",
  templateUrl: "./controls-panel.component.html",
  styleUrls: ["./controls-panel.component.css"]
})
export class ControlsPanelComponent {
  public controls: string[];
  public constructor() {
    this.controls = CONTROLS;
  }
}
