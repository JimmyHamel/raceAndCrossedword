import { Orientation, WordInterface } from "../../../../../common/interface/word-interface";
const MOCK_GRID: string[][] = [
  ["#", "#", "#", "A", "#", "L", "#", "#", "#", "p"],
  ["I", "B", "I", "S", "#", "O", "r", "a", "#", "i"],
  ["l", "e", "d", "#", "m", "G", "#", "s", "a", "t"],
  ["#", "#", "#", "#", "#", "I", "m", "p", "l", "y"],
  ["#", "s", "#", "v", "i", "C", "e", "#", "#", "#"],
  ["p", "a", "n", "i", "c", "#", "n", "j", "#", "r"],
  ["#", "n", "#", "#", "e", "l", "#", "#", "x", "i"],
  ["r", "e", "d", "#", "#", "#", "i", "n", "#", "c"],
  ["#", "#", "#", "d", "e", "l", "l", "#", "m", "e"],
  ["l", "e", "#", "c", "#", "a", "#", "#", "a", "#"],
];
const MOCK_WORDS: WordInterface[] = [
  { x: 1, y: 0, orientation: Orientation.vertical, word: "il", definition: "V-1-1" },
  { x: 1, y: 1, orientation: Orientation.vertical, word: "be", definition: "V-2-1" },
  { x: 4, y: 1, orientation: Orientation.vertical, word: "sane", definition: "V-2-2" },
  { x: 1, y: 2, orientation: Orientation.vertical, word: "id", definition: "V-3-1" },
  { x: 0, y: 3, orientation: Orientation.vertical, word: "as", definition: "V-4-1" },
  { x: 4, y: 3, orientation: Orientation.vertical, word: "vi", definition: "V-4-2" },
  { x: 8, y: 3, orientation: Orientation.vertical, word: "dc", definition: "V-4-3" },
  { x: 4, y: 4, orientation: Orientation.vertical, word: "ice", definition: "V-5-1" },
  { x: 0, y: 5, orientation: Orientation.vertical, word: "logic", definition: "V-6-1" },
  { x: 8, y: 5, orientation: Orientation.vertical, word: "la", definition: "V-6-2" },
  { x: 3, y: 6, orientation: Orientation.vertical, word: "men", definition: "V-7-1" },
  { x: 7, y: 6, orientation: Orientation.vertical, word: "il", definition: "V-7-2" },
  { x: 1, y: 7, orientation: Orientation.vertical, word: "asp", definition: "V-8-1" },
  { x: 2, y: 8, orientation: Orientation.vertical, word: "al", definition: "V-9-1" },
  { x: 8, y: 8, orientation: Orientation.vertical, word: "ma", definition: "V-9-2" },
  { x: 0, y: 9, orientation: Orientation.vertical, word: "pity", definition: "V-10-1" },
  { x: 5, y: 9, orientation: Orientation.vertical, word: "rice", definition: "V-10-2" },
  { x: 1, y: 0, orientation: Orientation.horizontal, word: "ibis", definition: "H-2-1" },
  { x: 1, y: 5, orientation: Orientation.horizontal, word: "ora", definition: "H-2-2" },
  { x: 2, y: 0, orientation: Orientation.horizontal, word: "led", definition: "H-3-1" },
  { x: 2, y: 4, orientation: Orientation.horizontal, word: "mg", definition: "H-3-2" },
  { x: 2, y: 7, orientation: Orientation.horizontal, word: "sat", definition: "H-3-3" },
  { x: 3, y: 5, orientation: Orientation.horizontal, word: "imply", definition: "H-4-1" },
  { x: 4, y: 3, orientation: Orientation.horizontal, word: "vice", definition: "H-5-1" },
  { x: 5, y: 0, orientation: Orientation.horizontal, word: "panic", definition: "H-6-1" },
  { x: 5, y: 6, orientation: Orientation.horizontal, word: "nj", definition: "H-6-2" },
  { x: 6, y: 4, orientation: Orientation.horizontal, word: "el", definition: "H-7-1" },
  { x: 6, y: 8, orientation: Orientation.horizontal, word: "xi", definition: "H-7-2" },
  { x: 7, y: 0, orientation: Orientation.horizontal, word: "red", definition: "H-8-1" },
  { x: 7, y: 6, orientation: Orientation.horizontal, word: "in", definition: "H-8-2" },
  { x: 8, y: 3, orientation: Orientation.horizontal, word: "dell", definition: "H-9-1" },
  { x: 8, y: 8, orientation: Orientation.horizontal, word: "me", definition: "H-9-2" },
  { x: 9, y: 0, orientation: Orientation.horizontal, word: "le", definition: "H-10-1" },
];

const MOCK_WORDS_STRING: string = "{" +
'{ x: 1, y: 0, orientation: Orientation.vertical, word: "il", definition: "V-1-1" },' +
'{ x: 1, y: 1, orientation: Orientation.vertical, word: "be", definition: "V-2-1" },' +
'{ x: 4, y: 1, orientation: Orientation.vertical, word: "sane", definition: "V-2-2" },' +
'{ x: 1, y: 2, orientation: Orientation.vertical, word: "id", definition: "V-3-1" },' +
'{ x: 0, y: 3, orientation: Orientation.vertical, word: "as", definition: "V-4-1" },' +
'{ x: 4, y: 3, orientation: Orientation.vertical, word: "vi", definition: "V-4-2" },' +
'{ x: 8, y: 3, orientation: Orientation.vertical, word: "dc", definition: "V-4-3" },' +
'{ x: 4, y: 4, orientation: Orientation.vertical, word: "ice", definition: "V-5-1" },' +
'{ x: 0, y: 5, orientation: Orientation.vertical, word: "logic", definition: "V-6-1" },' +
'{ x: 8, y: 5, orientation: Orientation.vertical, word: "la", definition: "V-6-2" },' +
'{ x: 3, y: 6, orientation: Orientation.vertical, word: "men", definition: "V-7-1" },' +
'{ x: 7, y: 6, orientation: Orientation.vertical, word: "il", definition: "V-7-2" },' +
'{ x: 1, y: 7, orientation: Orientation.vertical, word: "asp", definition: "V-8-1" },' +
'{ x: 2, y: 8, orientation: Orientation.vertical, word: "al", definition: "V-9-1" },' +
'{ x: 8, y: 8, orientation: Orientation.vertical, word: "ma", definition: "V-9-2" },' +
'{ x: 0, y: 9, orientation: Orientation.vertical, word: "pity", definition: "V-10-1" },' +
'{ x: 5, y: 9, orientation: Orientation.vertical, word: "rice", definition: "V-10-2" },' +
'{ x: 1, y: 0, orientation: Orientation.horizontal, word: "ibis", definition: "H-2-1" },' +
'{ x: 1, y: 5, orientation: Orientation.horizontal, word: "ora", definition: "H-2-2" },' +
'{ x: 2, y: 0, orientation: Orientation.horizontal, word: "led", definition: "H-3-1" },' +
'{ x: 2, y: 4, orientation: Orientation.horizontal, word: "mg", definition: "H-3-2" },' +
'{ x: 2, y: 7, orientation: Orientation.horizontal, word: "sat", definition: "H-3-3" },' +
'{ x: 3, y: 5, orientation: Orientation.horizontal, word: "imply", definition: "H-4-1" },' +
'{ x: 4, y: 3, orientation: Orientation.horizontal, word: "vice", definition: "H-5-1" },' +
'{ x: 5, y: 0, orientation: Orientation.horizontal, word: "panic", definition: "H-6-1" },' +
'{ x: 5, y: 6, orientation: Orientation.horizontal, word: "nj", definition: "H-6-2" },' +
'{ x: 6, y: 4, orientation: Orientation.horizontal, word: "el", definition: "H-7-1" },' +
'{ x: 6, y: 8, orientation: Orientation.horizontal, word: "xi", definition: "H-7-2" },' +
'{ x: 7, y: 0, orientation: Orientation.horizontal, word: "red", definition: "H-8-1" },' +
'{ x: 7, y: 6, orientation: Orientation.horizontal, word: "in", definition: "H-8-2" },' +
'{ x: 8, y: 3, orientation: Orientation.horizontal, word: "dell", definition: "H-9-1" },' +
'{ x: 8, y: 8, orientation: Orientation.horizontal, word: "me", definition: "H-9-2" },' +
'{ x: 9, y: 0, orientation: Orientation.horizontal, word: "le", definition: "H-10-1" }' +
"}";

export class MockGrid {
  public grid: string[][];
  public words: WordInterface[];
  public stringWords: string;

  public constructor() {
    this.initGrid();
    this.initWord();
    this.initStringWords();
  }
  private initGrid(): void {
    this.grid = MOCK_GRID;
  }
  private initWord(): void {
    this.words = MOCK_WORDS;
  }

  private initStringWords(): void {
    this.stringWords = MOCK_WORDS_STRING;
  }
}
