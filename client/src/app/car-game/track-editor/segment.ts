import { Point } from "./point";
import { DEFAULT_LINE_WIDTH, Y_AXIS } from "../constants";
import { Vector3 } from "three";

export const enum SegmentLine { firstLine, secondLine }
export const enum LinePoint { firstPoint, secondPoint }

export class Segment {
    private readonly _startPoint: Point;
    private readonly _endPoint: Point;
    private readonly _lines: Vector3[][];

    public constructor(firstPoint: Point, lastPoint: Point) {
        this._startPoint = firstPoint;
        this._endPoint = lastPoint;
        this._lines = [];
        this.calculateLines();
    }

    private calculateLines(): void {
        this.calculateOneLine(SegmentLine.firstLine);
        this.calculateOneLine(SegmentLine.secondLine);
    }

    private calculateOneLine(line: SegmentLine): void {
        this._lines[line] = [];
        this._lines[line][LinePoint.firstPoint] = this.calculateFirstPoint(line);
        this._lines[line][LinePoint.secondPoint] = this.calculateSecondPoint(line);
    }

    private calculateFirstPoint(line: SegmentLine): Vector3 {
        return line === SegmentLine.firstLine ?
            this._startPoint.position.clone().add(this.perpendicularDirection())
            : this._startPoint.position.clone().add(this.perpendicularDirection().negate());
    }

    private calculateSecondPoint(line: SegmentLine): Vector3 {
        return line === SegmentLine.firstLine ?
            this.calculateFirstPoint(line).add(this.getDirection())
            : this.calculateFirstPoint(line).add(this.getDirection());
    }

    private getDirection(): Vector3 {
        return new Vector3(this._endPoint.positionX - this._startPoint.positionX, 0,
                           this._endPoint.positionZ - this._startPoint.positionZ);
    }
    private perpendicularDirection(): Vector3 {
        return this.getDirection().clone().cross(Y_AXIS).normalize().multiplyScalar(DEFAULT_LINE_WIDTH / 2);
    }
    public get lines(): Vector3[][] {
        return this._lines;
    }
    public get startPoint(): Point {
        return this._startPoint;
    }
    public get endPoint(): Point {
        return this._endPoint;
    }
}
