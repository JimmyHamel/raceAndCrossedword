import { Component } from "@angular/core";
import { Orientation } from "../../../../../common/interface/word-interface";
import { GameObservableService } from "../game-observable.service";
import { DIMENSION } from "../info.service";

@Component({
  selector: "app-views",
  templateUrl: "./views.component.html",
  styleUrls: ["./views.component.css"]
})
export class ViewsComponent {

  public numbers: number[];
  public orientation: Orientation[];

  public constructor(private observable: GameObservableService) {
    this.numbers = [];
    this.initNumbers();
    this.orientation = [Orientation.horizontal, Orientation.vertical];
  }

  private initNumbers(): void {
    for (let i: number = 0; i < DIMENSION; i++) {
      this.numbers[i] = i + 1;
    }
  }
  /* tslint:disable: no-any */
  // Event est un any puisque lorsqu'on le cast on perd l'attribut target.
  public onClick(event: any): void {
    if (this.isClickContained(event)) {
      this.observable.notifyOutsideClick(false);
    } else {
      this.observable.notifyOutsideClick(true);
    }
  }

  private isClickContained(event: any): boolean {
    return this.isClickInCollection("cw-clues-container", event)
      || this.isClickInCollection("cw-board-container", event);
  }

  private isClickInCollection(className: string, event: any): boolean {
    /* tslint:disable: prefer-for-of */
    // Type 'HTMLCollectionOf<Element>' is not an array type or a string type.
    for (let i: number = 0; i < document.getElementsByClassName(className).length; i++) {
      if (document.getElementsByClassName(className)[i].contains(event.target)) {
        return true;
      }
    }

    return false;
  }
}
