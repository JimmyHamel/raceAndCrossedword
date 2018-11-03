import { WordInterface, Orientation } from "../../../../../common/interface/word-interface";
import { Box } from "./box-interface";
import { NO_CONTENT, HAS_FOCUS } from "./constant";
import { InfoService } from "../info.service";

export class Grid {

    public boxes: Array<Box>;
    public currentOrientation: Orientation;

    public constructor(private infoService: InfoService) {
        this.boxes = [];
        this.currentOrientation = Orientation.horizontal;
    }

    public calculateBoxIndexInGrid(wordIndex: number, indexInWord: number): number {
        const word: WordInterface = this.findWordInList(wordIndex);

        if (word) {
            return this.boxXPosition(word, indexInWord) + this.boxYPosition(word, indexInWord);
        } else {
            return 0;
        }
    }

    public calculateNextGridIndex(id: number): number {
        return id + this.calculateIndexShift();
    }

    public calculatePreviousGridIndex(id: number): number {
        return id - this.calculateIndexShift();
    }

    public isGoodLetter(box: Box): boolean {
        return this.infoService.grid[this.calculateXPosition(box.id)][this.calculateYPosition(box.id)] === box.value;
    }

    public isWordFull(wordIndex: number): boolean {
        for (let i: number = 0; i < this.findWordInList(wordIndex).word.length; i++) {
            if (this.isLetterEmpty(this.findBoxFromWordIndex(wordIndex, i))) {
                return false;
            }
        }

        return true;
    }

    public isLetterEmpty(box: Box): boolean {
        return box.value === NO_CONTENT;
    }

    public findFirstEmptyBox(id: number): number {
        while (!this.isLetterEmpty(this.boxes[id])) {
            id = this.calculateNextGridIndex(id);
        }

        return id;
    }

    public findBoxFromBox(box: Box, index: number, orientation: Orientation): Box {
        return this.findBoxFromWordIndex(this.currentWordIndex(box, orientation), index);
    }

    public findBoxFromWordIndex(wordIndex: number, index: number): Box {
        return this.boxes[this.calculateBoxIndexInGrid(wordIndex, index)];
    }

    public findWordInList(index: number): WordInterface {
        return this.infoService.words[index];
    }

    public currentWordIndex(box: Box, orientation: Orientation): number {
        return box.inWordIndex[orientation];
    }

    public otherOrientation(orientation: Orientation): number {
        return 1 - orientation;
    }

    public removeWordFocus(player: number): void {
        for (const box of this.boxes) {
            box.hasWordFocus[player] = !HAS_FOCUS;
        }
    }

    public focusOnBox(boxId: number, next: boolean): void {
        if (this.isBoxInList(boxId)) {
            while (this.boxes[boxId].isWordValid[this.infoService.currentPlayer] ||
                this.boxes[boxId].isWordValid[this.infoService.otherPlayer()]) {

                boxId = this.nextIndexRightDirection(boxId, next);
            }

            document.getElementById(boxId.toString()).focus();
        }
    }

    private calculateXPosition(id: number): number {
        return Math.floor((id) / this.infoService.grid.length);
    }

    private calculateYPosition(id: number): number {
        return id % this.infoService.grid.length;
    }

    private calculateIndexShift(): number {
        return this.infoService.grid.length * this.currentOrientation + (1 - this.currentOrientation);
    }

    private boxXPosition(word: WordInterface, indexInWord: number): number {
        return word.x * this.infoService.grid.length + indexInWord * this.infoService.grid.length * word.orientation;
    }

    private boxYPosition(word: WordInterface, indexInWord: number): number {
        return word.y + indexInWord * (this.otherOrientation(word.orientation));
    }

    private nextIndexRightDirection(boxId: number, next: boolean): number {
        if (next) {
            return this.calculateNextGridIndex(boxId);
        } else {
            return this.calculatePreviousGridIndex(boxId);
        }
    }

    private isBoxInList(boxId: number): boolean {
        return (boxId >= 0 && boxId < this.boxes.length);
    }
}
