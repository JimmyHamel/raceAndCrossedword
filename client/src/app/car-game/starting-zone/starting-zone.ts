import { Vector3, Line, Geometry, LineBasicMaterial, Color, Object3D } from "three";
import { Point } from "../track-editor/point";
import {
    Y_AXIS, DEFAULT_LINE_WIDTH, HALF, PLAYER_FOUR, PLAYER_THREE, LINE_OFFSET,
    PLAYER_TWO, PLAYER_ONE, STARTING_LINE_POSITION_Y, POSITION_OFFSET
} from "../constants";

export class StartingZone extends Object3D {
    private _center: Vector3;
    private _startingGrid: number[];
    private _startingPosition: Vector3[];
    private _rotation: number;
    private _startingLine: Line;

    public constructor(points: Point[]) {
        super();
        this._startingGrid = this.generateRandomStartingGrid();
        const startingZoneDirection: Vector3 = points[1].position.clone().sub(points[0].position);
        this._center = points[0].position.clone().add(startingZoneDirection.clone().multiplyScalar(HALF));
        this.calculateRotation(startingZoneDirection);
        this._startingPosition = this.generateStartingPosition(startingZoneDirection);

        const startingLineMiddle: Vector3 = this._center.clone().add(startingZoneDirection.clone().setLength(LINE_OFFSET));
        const lineGeometry: Geometry = new Geometry();
        const perpendicularDirection: Vector3 = startingZoneDirection.clone().cross(Y_AXIS);
        lineGeometry.vertices.push(startingLineMiddle.clone().add(perpendicularDirection.clone().setLength(DEFAULT_LINE_WIDTH / 2)));
        lineGeometry.vertices.push(startingLineMiddle.clone().sub(perpendicularDirection.clone().setLength(DEFAULT_LINE_WIDTH / 2)));
        this._startingLine = new Line(lineGeometry, new LineBasicMaterial({ color: new Color(1, 1, 1) }));
        this._startingLine.position.setY(STARTING_LINE_POSITION_Y);
        this.add(this._startingLine);
    }

    private generateRandomStartingGrid(): number[] {
        const startingGrid: number[] = [PLAYER_ONE, PLAYER_TWO, PLAYER_THREE, PLAYER_FOUR];
        for (let i: number = startingGrid.length - 1; i > 0; i--) {
            const j: number = Math.floor(Math.random() * (i + 1));
            [startingGrid[i], startingGrid[j]] = [startingGrid[j], startingGrid[i]];
        }

        return startingGrid;
    }

    private generateStartingPosition(startingZoneDirection: Vector3): Vector3[] {
        const finalPositions: Vector3[] = [];

        for (let i: number = 0; i < this._startingGrid.length; i++) {
            finalPositions[i] = this._center.clone();
            const xOffsetDirection: number = (i < POSITION_OFFSET) ? (1) : (-1);
            const yOffsetDirection: number = (i % POSITION_OFFSET) ? (1) : (-1);
            const offset: Vector3 = (new Vector3(xOffsetDirection * POSITION_OFFSET, 0, yOffsetDirection * POSITION_OFFSET))
                .applyAxisAngle(Y_AXIS, this.objectRotation);
            finalPositions[i].add(offset);
        }

        return finalPositions;
    }

    private calculateRotation(startingZoneDirection: Vector3): void {
        this._rotation = Math.atan2(startingZoneDirection.z, -startingZoneDirection.x);
    }

    public get startingGrid(): number[] {
        return this._startingGrid;
    }

    public get startingPosition(): Vector3[] {
        return this._startingPosition;
    }

    public get objectRotation(): number {
        return this._rotation;
    }

    public get startingLine(): Line {
        return this._startingLine;
    }

    public get center(): Vector3 {
        return this._center;
    }
}
