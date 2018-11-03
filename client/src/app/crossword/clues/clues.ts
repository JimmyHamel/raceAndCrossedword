import { WordInterface, Orientation } from "../../../../../common/interface/word-interface";
import { Clue } from "./clue-interface";
import { DIMENSION } from "../info.service";

const SELECTED: boolean = true;
const COMPLETED: boolean = true;
const BACKSLASH_SPACE_CODE: number = 9;

export class Clues {

    public clues: Array<Clue>;
    private orientation: Orientation;
    private words: WordInterface[];
    public constructor(words: WordInterface[], orientation: Orientation) {
        this.clues = [];
        this.orientation = orientation;
        this.words = words;
        this.initClues();
    }

    private initClues(): void {
        this.mapClues();
        this.sortClues();
        this.fixClueTag();
    }

    private mapClues(): void {
        for (let i: number = 0; i < this.words.length; i++) {
            if (this.words[i].orientation === this.orientation) {
                this.clues.push({
                    id: "clue" + i,
                    word: this.words[i].word,
                    definition: this.trunkDefinition(this.words[i].definition),
                    wordIndex: i,
                    clueTag: this.calcultateClueTag(this.words[i]),
                    isSelected: [!SELECTED, !SELECTED],
                    isCompleted: [!COMPLETED, !COMPLETED],
                    isHovered: false,
                });
            }
        }
    }
    private trunkDefinition(definition: string): string {
        if (definition.charCodeAt(1) === BACKSLASH_SPACE_CODE) {
            return definition.substr(2, definition.length - 2);
        } else {
            return definition;
        }
    }
    private calcultateClueTag(word: WordInterface): number {
        if (word.orientation) {
            return (word.y + 1) + (word.x + 1) / DIMENSION;
        } else {
            return (word.x + 1) + (word.y + 1) / DIMENSION;
        }
    }

    private sortClues(): void {
        this.clues.sort((a: Clue, b: Clue): number => {
            if (a.clueTag < b.clueTag) {
                return -1;
            }
            if (a.clueTag > b.clueTag) {
                return 1;
            }

            return 0;
        });
    }

    private fixClueTag(): void {
        let clueFirstDigit: number = 1;
        let clueSecondDigit: number = 0;
        for (const clue of this.clues) {
            if (Math.floor(clue.clueTag) === clueFirstDigit) {
                clueSecondDigit++;
            } else {
                clueFirstDigit++;
                clueSecondDigit = 1;
            }
            clue.clueTag = Math.floor(clue.clueTag) + (clueSecondDigit / DIMENSION);
        }
    }

}
