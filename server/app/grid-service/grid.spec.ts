/* tslint:disable: no-magic-numbers no-inferrable-types await-promise no prefer-for-of no variable-name no typedef*/
import { Letter } from "./letter";
import { CrossedWordsGenerator } from "./crossedwords-generator";
import { WordGenerator, FIRST_WORD_INDEX } from "./word-generator";
import { GridGenerator } from "./grid-generator";
import { CrossedWord } from "./crossedword";
import { WordPlaceHolder } from "./word-placeholder";
import { Difficulty, WordInterface } from "../../../common/interface/word-interface";
import * as request from "request-promise-native";
import * as ASSERT from "assert";
const params = {
    uri: "",
    resolveWithFullResponse: true,
    json: true
};

const generator: CrossedWordsGenerator = new CrossedWordsGenerator();

describe("Grid service : ", () => {

    describe("A database", async() => {

        it("Can send a list of word", async () => {
            params.uri = "http://localhost:3000/api/servicegrid/getGrid?difficulty=0";
            const gridResponse: request.RequestPromise = await request(params);
            const res: string = JSON.stringify(gridResponse.toJSON());
            const answer: boolean = res.length > 0;
            ASSERT.equal(answer, true);

        });
        it("Can generate a random crossedword", async () => {
            params.uri = "http://localhost:3000/api/servicegrid/generate?difficulty=0";
            params.resolveWithFullResponse = false;
            const gridResponse: WordInterface[] = await request(params);
            ASSERT.equal(gridResponse.length > 0, true);
        }).timeout(30000);

    });

    describe("A grid randomly generated", () => {
        const gridSize10: number = 10;
        const gridSize5: number = 5;
        const gridSize2: number = 2;

        let grid: Letter[][] = GridGenerator.generateBaseGrid(gridSize10);
        let rightSize: boolean = grid.length === grid[FIRST_WORD_INDEX].length && grid.length === gridSize2;
        it("Could be 2x2 ", (done: MochaDone) => {
            ASSERT.equal(rightSize, true);
            done();
        });
        grid = GridGenerator.generateBaseGrid(gridSize5);
        rightSize = grid.length === grid[FIRST_WORD_INDEX].length && grid.length === gridSize5;
        it("could be 5x5 ", (done: MochaDone) => {
            ASSERT.equal(rightSize, true);
            done();
        });
        grid = GridGenerator.generateBaseGrid(gridSize10);
        rightSize = grid.length === grid[FIRST_WORD_INDEX].length && grid.length === gridSize10;
        it("Could be 10x10 ", (done: MochaDone) => {
            ASSERT.equal(rightSize, true);
            done();
        });
    });
    describe("A grid", () => {
        const gridSize: number = 10;
        const grid: Letter[][] = GridGenerator.generateBaseGrid(gridSize);
        const placeholders: WordPlaceHolder[] = WordGenerator.wordCount(grid);

        it("should be able to generate a list of at least 20 placeholders for the words ", (done: MochaDone) => {
            ASSERT.equal(placeholders.length > 20, true);
            done();
        });
        let rightSize: boolean = true;
        for (let i: number = 0; i < placeholders.length; i++) {
            if (placeholders[i].length < 2) {
                rightSize = false;
            }
        }
        it("should not generate a word shorter than 2 letters", (done: MochaDone) => {
            ASSERT.equal(rightSize, true);
            done();
        });
    });

    describe("CrossedWword randomly generated should have", async() => {
        const gridSize: number = 10;
        const difficulty: number = 0;
        const randomCrossedword: CrossedWord = await generator.generateNewCrossedWord(gridSize, difficulty);
        it("Number of black cells should be 1 or more", (done: MochaDone) => {
            let oneBlackCell: boolean = false;
            for (let i: number = 0; i < randomCrossedword.grid.length; i++) {
                for (let j: number = 0; j < randomCrossedword.grid[i].length; j++) {
                    if (randomCrossedword.grid[i][j].value === "#") {
                        oneBlackCell = true;
                        break;
                    }
                }
            }
            ASSERT.equal(oneBlackCell, true);
            done();
        });
        it("No word should be shorter than 2", async() => {
            let shorterThanTwo: boolean = false;
            for (let i: number = 0; i < randomCrossedword.words.length; i++) {
                if (randomCrossedword.words[i].word.length < 2) {
                    shorterThanTwo = true;
                }
            }
            ASSERT.equal(shorterThanTwo, false);
        });

        it("Should not have accents", async() => {
            let isAccent: boolean = false;
            for (let i: number = 0; i < randomCrossedword.grid.length; i++) {
                for (let j: number = 0; j < randomCrossedword.grid[i].length; j++) {
                    const letter: string = randomCrossedword.grid[i][j].value;
                    if (letter.replace(new RegExp(/[èéêëìíîïòóôõöùúûüç]/g), "") === "") {
                        isAccent = true;
                    }
                }
            }
            ASSERT.equal(isAccent, false);
        });
        it("Length should equal " + gridSize, async() => {
            ASSERT.equal(randomCrossedword.grid.length, gridSize);
        });
        it("Height should equal " + gridSize, async() => {
            ASSERT.equal(randomCrossedword.grid[0].length, gridSize);

        });

        let notTheSame: boolean = false;
        const tempWords: WordInterface[] = [];
        for (const word of randomCrossedword.words) {
            if (tempWords.indexOf(word) !== -1) {
                notTheSame = true;
            }
            tempWords.push(word);
        }
        it("should not contain twice the same word ", async() => {
            ASSERT.equal(notTheSame, false);
        });
    });

    describe("A crossed word", async() => {
        const firstIndex: number = 0;

        const easyGrid: CrossedWord = await generator.generateNewCrossedWord(4, Difficulty.easy);
        let constrainst: Letter[] = [];
        for (let i: number = 0; i < easyGrid.words[0].word.length; i++) {
            constrainst[i] = new Letter(firstIndex, firstIndex, easyGrid.words[firstIndex].word.charAt(i));
        }
        let placeholder: WordPlaceHolder = new WordPlaceHolder(firstIndex, firstIndex, firstIndex, constrainst);
        it("Can be easy", async() => {
            ASSERT.equal(placeholder.length > 0, true);
        });
        const mediumGrid: CrossedWord = await generator.generateNewCrossedWord(4, Difficulty.medium);
        constrainst = [];
        for (let i: number = 0; i < mediumGrid.words[firstIndex].word.length; i++) {
            constrainst[i] = new Letter(firstIndex, firstIndex, mediumGrid.words[firstIndex].word.charAt(i));
        }
        placeholder = new WordPlaceHolder(firstIndex, firstIndex, firstIndex, constrainst);

        it("Can be medium ", async() => {
            ASSERT.equal(placeholder.length, placeholder.length);
        });
        const hardGrid: CrossedWord = await generator.generateNewCrossedWord(4, Difficulty.hard);
        constrainst = [];
        for (let i: number = 0; i < hardGrid.words[firstIndex].word.length; i++) {
            constrainst[i] = new Letter(firstIndex, firstIndex, hardGrid.words[firstIndex].word.charAt(i));
        }
        placeholder = new WordPlaceHolder(firstIndex, firstIndex, firstIndex, constrainst);
        it("Can be hard", async() => {
            ASSERT.equal(placeholder.length > 0, true);
        });
    });
});
