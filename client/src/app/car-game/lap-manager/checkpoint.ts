import { Point } from "../track-editor/point";
import { OrientedBoundingRectangle } from "../collision/oriented-bounding-rectangle";
import { CIRCLE_RADIUS } from "../constants";
import { Geometry, Vector3, Line } from "three";

export class Checkpoint {
    private readonly _radius: number;
    private _point: Point;
    private _line: OrientedBoundingRectangle;
    private _next: Checkpoint;
    private _previous: Checkpoint;

    public constructor(point: Point) {
        this._point = point;
        const segmentBefore: Vector3 = point.position.clone().sub(point.previous.position).normalize();
        const segmentAfter: Vector3 = point.next.position.clone().sub(point.position).normalize();
        const angleBetweenSegments: number = Math.acos(segmentBefore.dot(segmentAfter.clone().negate()) /
                                                      (segmentBefore.length() * segmentAfter.length()));
        const lineGeometry: Geometry = new Geometry();
        const radiusDirection: Vector3 = segmentBefore.clone().sub(segmentAfter.clone());
        const extraRadius: number = this.calculateExtraRadius(angleBetweenSegments);
        lineGeometry.vertices.push(point.position.clone().add(radiusDirection.clone().setLength(CIRCLE_RADIUS + extraRadius)));
        lineGeometry.vertices.push(point.position.clone().sub(radiusDirection.clone().setLength(CIRCLE_RADIUS + extraRadius)));
        this._line = new OrientedBoundingRectangle(undefined, new Line(lineGeometry));
        this._radius = CIRCLE_RADIUS + extraRadius;
    }

    private calculateExtraRadius(theta: number): number {
        return CIRCLE_RADIUS / (Math.cos((Math.PI - theta) / 2)) - CIRCLE_RADIUS;
    }

    public get next(): Checkpoint {
        return this._next;
    }

    public set next(checkPoint: Checkpoint) {
        this._next = checkPoint;
    }

    public get previous(): Checkpoint {
        return this._previous;
    }

    public set previous(checkPoint: Checkpoint) {
        this._previous = checkPoint;
    }

    public get point(): Point {
        return this._point;
    }
    public get line(): OrientedBoundingRectangle {
        return this._line;
    }
    public get radius(): number {
        return this._radius;
    }
}
