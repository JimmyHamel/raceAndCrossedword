import { NgGridItemConfig } from "angular2-grid";
export interface Box {
    id: number;
    config: NgGridItemConfig;
    value: string;
    inWordIndex: number[];
    isWritable: boolean;
    hasWordFocus: boolean[];
    isWordValid: boolean[];
}
