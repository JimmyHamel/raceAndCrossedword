import { Box } from "./box-interface";
import { Injectable } from "@angular/core";
import { Orientation } from "../../../../../common/interface/word-interface";
import { InfoService } from "../info.service";
import { GameObservableService } from "../game-observable.service";
import { HAS_FOCUS, WORD_VALID, BACKSPACE, NO_CONTENT } from "./constant";
import { Grid } from "./grid";

@Injectable()
export class GridService {

    public grid: Grid;

    public constructor(private infoService: InfoService, private observable: GameObservableService) {
        this.grid = new Grid(this.infoService);
        this.subscribeToObservables();
    }

    public reset(): void {
        this.grid = new Grid(this.infoService);
    }
    public handleClick(box: Box): void {
        if (box.isWritable) {
            this.selectWord(this.chooseWordToSelect(box));
            this.observable.notifyIndexSelectedWord(this.chooseWordToSelect(box));
        }
    }

    public handleOutClick(outClick: boolean): void {
        if (outClick) {
            this.grid.removeWordFocus(this.infoService.currentPlayer);
        }
    }

    public mapBoxToWords(): void {
        for (let i: number = 0; i < this.infoService.words.length; i++) {
            for (let j: number = 0; j < this.grid.findWordInList(i).word.length; j++) {
                this.grid.findBoxFromWordIndex(i, j).inWordIndex[this.grid.findWordInList(i).orientation] = i;
            }
        }
    }

    public moveFocus(keyCode: number, box: Box): void {
        if (keyCode === BACKSPACE) {
            this.grid.focusOnBox(this.grid.calculatePreviousGridIndex(box.id), false);
            box.value = NO_CONTENT;
        } else {
            if (!this.grid.isLetterEmpty(box)) {
                if (this.validateWord(box, this.grid.currentOrientation)) {
                    this.observable.notifyIndexCompletedWord(this.grid.currentWordIndex(box, this.grid.currentOrientation));
                    this.validateAllCrossingWords(box, this.grid.currentOrientation);
                }
                this.grid.focusOnBox(this.grid.calculateNextGridIndex(box.id), true);
            }
        }
    }

    private subscribeToObservables(): void {
        this.observable.getIndexSelectedWord().subscribe((index: number) => {
            this.selectWord(index);
        });

        this.observable.getIndexSecondPlayerSelectedWord().subscribe((index: number) => {
            this.selectSecondWord(index);
        });

        this.observable.getIndexSecondPlayerCompletedWord().subscribe((index: number) => {
            this.completeSecondWord(index);
        });

        this.observable.getOutsideClick().subscribe((outClick: boolean) => {
            this.handleOutClick(outClick);
        });
    }

    private validateWord(box: Box, orientation: Orientation): boolean {
        const wordIndex: number = this.grid.currentWordIndex(box, orientation);

        if ((this.infoService.wordFlags[wordIndex] !== this.infoService.otherPlayer()) &&
            (wordIndex !== -1) &&
            (this.grid.isWordFull(wordIndex))) {

            for (let i: number = 0; i < this.grid.findWordInList(wordIndex).word.length; i++) {
                if (!this.grid.isGoodLetter(this.grid.boxes[this.grid.calculateBoxIndexInGrid(wordIndex, i)])) {
                    return false;
                }
            }

            this.colorGoodWord(box, orientation);

            return true;
        }

        return false;
    }

    private validateAllCrossingWords(box: Box, orientation: Orientation): void {
        const otherOrientation: Orientation = this.grid.otherOrientation(orientation);

        for (let i: number = 0; i < this.grid.findWordInList(this.grid.currentWordIndex(box, orientation)).word.length; i++) {

            const boxI: Box = this.grid.findBoxFromBox(box, i, orientation);

            if (this.validateWord(boxI, otherOrientation)) {
                this.observable.notifyIndexCompletedWord(this.grid.currentWordIndex(boxI, otherOrientation));
            }
        }
    }

    private colorGoodWord(box: Box, orientation: Orientation): void {
        for (let indexInWord: number = 0; indexInWord < this.grid.findWordInList(
            this.grid.currentWordIndex(box, orientation)).word.length; indexInWord++) {
            this.colorGoodBox(box, orientation, indexInWord);
        }
    }

    private colorGoodBox(box: Box, orientation: Orientation, indexInWord: number): void {
        this.grid.findBoxFromBox(box, indexInWord, orientation).isWordValid[this.infoService.currentPlayer] = WORD_VALID;
    }

    private chooseWordToSelect(box: Box): number {
        if (box.inWordIndex[Orientation.horizontal] === -1) {
            return box.inWordIndex[Orientation.vertical];
        } else {
            return box.inWordIndex[Orientation.horizontal];
        }
    }

    private selectWord(index: number): void {
        this.grid.removeWordFocus(this.infoService.currentPlayer);
        this.grid.currentOrientation = this.grid.findWordInList(index).orientation;

        for (let i: number = 0; i < this.grid.findWordInList(index).word.length; i++) {
            this.grid.findBoxFromWordIndex(index, i).hasWordFocus[this.infoService.currentPlayer] = HAS_FOCUS;
        }

        this.grid.focusOnBox(this.grid.findFirstEmptyBox(this.grid.findBoxFromWordIndex(index, 0).id), true);
    }

    private completeSecondWord(index: number): void {
        this.grid.removeWordFocus(this.infoService.otherPlayer());

        for (let i: number = 0; i < this.grid.findWordInList(index).word.length; i++) {

            if (this.infoService.wordFlags[index] !== this.infoService.currentPlayer) {
                const box: Box = this.grid.findBoxFromWordIndex(index, i);

                box.isWordValid[this.infoService.otherPlayer()] = WORD_VALID;
                box.value = this.grid.findWordInList(index).word[i];
            }
        }
    }

    private selectSecondWord(index: number): void {
        this.grid.removeWordFocus(this.infoService.otherPlayer());

        for (let i: number = 0; i < this.grid.findWordInList(index).word.length; i++) {
            this.grid.findBoxFromWordIndex(index, i).hasWordFocus[this.infoService.otherPlayer()] = HAS_FOCUS;
        }
    }
}
