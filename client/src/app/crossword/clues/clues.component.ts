import { Component, Input, OnInit } from "@angular/core";
import { Orientation } from "../../../../../common/interface/word-interface";
import { InfoService } from "../info.service";
import { GameObservableService } from "../game-observable.service";
import { Clues } from "./clues";
import { Clue } from "./clue-interface";

@Component({
  selector: "app-clues",
  templateUrl: "./clues.component.html",
  styleUrls: ["./clues.component.css"],
})
export class CluesComponent implements OnInit {

  public clues: Clues;

  public constructor(private infoService: InfoService, private observable: GameObservableService) {}

  @Input() private orientation: Orientation;

  public ngOnInit(): void {
    this.clues = new Clues(this.infoService.words, this.orientation);
    this.subscribeToObservables();
  }

  public onClick(clue: Clue): void {
    if (!clue.isCompleted[this.infoService.currentPlayer] && !clue.isCompleted[this.infoService.otherPlayer()]) {
      this.observable.notifyIndexSelectedWord(clue.wordIndex);
    }
  }

  private handleOutClick(outClick: boolean): void {
    if (outClick) {
      this.removeAllColor(this.infoService.currentPlayer);
    }
  }

  private subscribeToObservables(): void {

    this.observable.getIndexSelectedWord().subscribe((index: number) => {
      this.colorateClue(index, this.infoService.currentPlayer);
    });

    this.observable.getIndexCompletedWord().subscribe((index: number) => {
      this.crossClue(index, this.infoService.currentPlayer);
    });

    this.observable.getOutsideClick().subscribe((outClick: boolean) => {
      this.handleOutClick(outClick);
    });

    this.observable.getIndexSecondPlayerCompletedWord().subscribe((index: number) => {
      this.colorateClue(index, this.infoService.otherPlayer());
      this.crossClue(index, this.infoService.otherPlayer());
    });

    this.observable.getIndexSecondPlayerSelectedWord().subscribe((index: number) => {
      this.colorateClue(index, this.infoService.otherPlayer());
    });

  }

  private colorateClue(index: number, player: number): void {
    this.removeAllColor(player);
    if (this.findClue(index)) {
      this.findClue(index).isSelected[player] = true;
    }
  }

  private removeAllColor(player: number): void {
    for (let i: number = 0; i < this.infoService.words.length; i++) {
      if (this.findClue(i)) {
        this.findClue(i).isSelected[player] = false;
      }
    }
  }

  private crossClue(index: number, player: number): void {
    if (this.findClue(index)) {
      this.findClue(index).isCompleted[player] = true;
    }
  }

  private findClue(index: number): Clue {
    return this.clues.clues.find((clue) => clue.wordIndex === index);
  }

}
