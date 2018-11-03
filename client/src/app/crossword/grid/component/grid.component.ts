import { Component, OnInit } from "@angular/core";
import { InitializeService } from "../initializer.service";
import { GridService } from "../grid.service";
import { Box } from "../box-interface";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.css"],
})

export class GridComponent implements OnInit {

  public constructor(
    private initialiserService: InitializeService,
    private gridService: GridService
  ) { }

  public ngOnInit(): void {
    this.initialiserService.buildGrid();
    this.gridService.mapBoxToWords();
  }
  public onClick(box: Box): void {
    this.gridService.handleClick(box);
  }
  public onKeyUp(box: Box, event: KeyboardEvent): void {
    this.gridService.moveFocus(event.keyCode, box);
  }
}
