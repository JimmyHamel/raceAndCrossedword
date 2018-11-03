import { Letter } from "./letter";
import { BLACK_CELL } from "./word-generator";

const RATIO_BLACK_CELLS: number = 0.75;

export class GridGenerator {

    public static generateBaseGrid(gridLength: number): Letter[][] {
        const grid: Letter[][] = [];
        this.initGrid(grid, gridLength);
        this.placeBlackCells(grid);

        return grid;
    }
    private static initGrid(grid: Letter[][], gridLength: number): void {
        for (let i: number = 0; i < gridLength; i++) {
            grid[i] = [];
            for (let j: number = 0; j < gridLength; j++) {
                grid[i][j] = new Letter(i, j);
            }
        }

    }
    private static placeBlackCells(grid: Letter[][]): void {
        const maxBlackCellsPerLine: number = Math.floor(RATIO_BLACK_CELLS * grid.length);
        for (let line: number = 0; line < grid.length; line++) {
            const blackCellsInLine: number = this.generateRandomNumberOfBlackCells(maxBlackCellsPerLine);
            const blackCellsIndex: number[] = this.generateBlackCellsIndex(grid.length, blackCellsInLine);
            this.placeBlackCellsInLine(grid, blackCellsIndex, line);
        }

    }
    private static placeBlackCellsInLine(grid: Letter[][], blackCellsIndexs: number[], line: number): void {
        for (const indexBlackCell of blackCellsIndexs) {
            grid[line][indexBlackCell].value = BLACK_CELL;
        }
    }

    private static generateBlackCellsIndex(gridLength: number, numberOfBlackCells: number): number[] {
        const blackCellsIndex: number[] = [];
        for (let i: number = 0; i < numberOfBlackCells; i++) {
            blackCellsIndex[i] = Math.floor(Math.random() * gridLength);
        }

        return blackCellsIndex;
    }

    private static generateRandomNumberOfBlackCells(ratio: number): number {
        return Math.ceil(Math.random() * RATIO_BLACK_CELLS * ratio);
    }

}
