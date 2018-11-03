import { Injectable } from "@angular/core";
import { NgGridConfig, NgGridItemConfig } from "angular2-grid";
import {
    WRITABLE,
    HAS_FOCUS,
    WORD_VALID,
    NO_CONTENT,
    BLACK_CELL
} from "./constant";
import { GridService } from "./grid.service";
import { InfoService } from "../info.service";

@Injectable()
export class InitializeService {

    private curNum: number;
    public gridConfig: NgGridConfig;

    public constructor(private gridService: GridService, private infoService: InfoService) {
        this.curNum = 0;
        this.gridConfig = this.initVariables();
    }

    public buildGrid(): void {
        this.initGrid();
        for (let row: number = 0; row < this.infoService.grid.length; row++) {
            for (let col: number = 0; col < this.infoService.grid.length; col++) {
                this.addCell(row + 1, col + 1, this.isWritableCell(this.infoService.grid[row][col]));
            }
        }
    }

    private initGrid(): void {
        const dashconf: NgGridItemConfig[] = this.generateDefaultDashConfig();
        for (let i: number = 0; i < dashconf.length; i++) {
            const conf: NgGridItemConfig = dashconf[i];
            conf.payload = i;
            this.gridService.grid.boxes[i] = {
                id: i,
                config: conf,
                value: NO_CONTENT,
                inWordIndex: [0, 0],
                isWritable: WRITABLE,
                hasWordFocus: [!HAS_FOCUS, !HAS_FOCUS],
                isWordValid: [!WORD_VALID, !WORD_VALID],
            };
        }
        this.curNum = dashconf.length;
    }

    private addCell(rowIndex: number, colIndex: number, isWritableInput: boolean): void {
        const conf: NgGridItemConfig = this.generateDefaultItemConfig();
        conf.payload = this.curNum++;
        conf.col = colIndex;
        conf.row = rowIndex;
        this.gridService.grid.boxes.push({
            id: conf.payload,
            config: conf,
            value: NO_CONTENT,
            inWordIndex: [-1, -1],
            isWritable: isWritableInput,
            hasWordFocus: [!HAS_FOCUS, !HAS_FOCUS],
            isWordValid: [!WORD_VALID, !WORD_VALID],
        });
    }

    private initVariables(): NgGridConfig {
        return {
            "margins": [0],
            "draggable": false,
            "resizable": false,
            "max_cols": 0,
            "max_rows": 0,
            "visible_cols": 0,
            "visible_rows": 0,
            "min_cols": 1,
            "min_rows": 1,
            "col_width": 40,
            "row_height": 40,
            "cascade": "up",
            "min_width": 1,
            "min_height": 1,
            "fix_to_grid": false,
            "auto_style": true,
            "auto_resize": false,
            "maintain_ratio": false,
            "prefer_new": false,
            "zoom_on_drag": false,
            "limit_to_screen": true
        };
    }

    private generateDefaultItemConfig(): NgGridItemConfig {
        return { "col": 1, "row": 1, "sizex": 1, "sizey": 1 };
    }

    private generateDefaultDashConfig(): NgGridItemConfig[] {
        return [];
    }

    private isWritableCell(cell: string): boolean {
        return !(cell === BLACK_CELL);
    }
}
