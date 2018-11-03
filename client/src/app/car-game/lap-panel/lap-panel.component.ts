import { Component } from "@angular/core";
import { LapService } from "../lap-manager/lap.service";

@Component({
  selector: "app-lap-panel",
  templateUrl: "./lap-panel.component.html",
  styleUrls: ["./lap-panel.component.css"]
})
export class LapPanelComponent {

  public constructor(public lapService: LapService) { }

}
