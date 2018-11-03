import { Point } from "../point";
import { Path } from "../path";
import { Vector3, Raycaster, Intersection, Object3D} from "three";
import {DEFAULT_LINE_WIDTH, CIRCLE_RADIUS} from "../../constants";
const NUMBER_OF_POINTS_FOR_CONSTRAINT: number = 2;
const LINES_PER_POINT: number = 2;
const BEFORE_LAST_LINE_INDEX_OFFSET: number = 3;
const LAST_LINE_INDEX_OFFSET: number = 4;
export class SegmentsTouchingConstraint {

    public isRespected(lastPoint: Point, beforeLastPoint: Point, trackPath: Path): boolean {
        this.removeTemporarilyLastLines(lastPoint, trackPath.lineContainer, trackPath);
        const direction: Vector3 = lastPoint.position.clone().sub(beforeLastPoint.position).normalize();
        const leftRay: Raycaster = new Raycaster(this.calculateLeftOriginVector(beforeLastPoint.position, direction),
                                                 direction, 0,
                                                 this.lineLength(lastPoint, beforeLastPoint) + CIRCLE_RADIUS);
        const rightRay: Raycaster = new Raycaster(this.calculateRightOriginVector(beforeLastPoint.position, direction),
                                                  direction, 0,
                                                  this.lineLength(lastPoint, beforeLastPoint) + CIRCLE_RADIUS);
        const intersect: Intersection[] = rightRay.intersectObjects([trackPath.lineContainer].concat(trackPath.points), true)
            .concat(leftRay.intersectObjects([trackPath.lineContainer].concat(trackPath.points), true));
        this.addLastLinesBack(lastPoint, trackPath.lineContainer, trackPath);

        return intersect.length <= 0;
    }

    private removeTemporarilyLastLines(lastPoint: Point, lines: Object3D, trackPath: Path): void {
        if (lastPoint !== trackPath.findLastPoint() || trackPath.isCompleted) {
            lines.remove(trackPath.lines[(trackPath.findPointIndex(lastPoint) * 2  ) % trackPath.lines.length] );
            lines.remove(trackPath.lines[(trackPath.findPointIndex(lastPoint) * 2 + 1) % trackPath.lines.length]);
        }
        lines.remove(trackPath.lines[(trackPath.findPointIndex(lastPoint) * 2 - 1 + trackPath.lines.length) % trackPath.lines.length]);
        lines.remove(trackPath.lines[(trackPath.findPointIndex(lastPoint) * 2 - 2 + trackPath.lines.length) % trackPath.lines.length]);

        if (trackPath.findPointIndex(lastPoint) * 2 >= NUMBER_OF_POINTS_FOR_CONSTRAINT * LINES_PER_POINT || trackPath.isCompleted) {
            lines.remove(trackPath.lines[(trackPath.findPointIndex(lastPoint) * 2 - BEFORE_LAST_LINE_INDEX_OFFSET
                                          + trackPath.lines.length) % trackPath.lines.length]);
            lines.remove(trackPath.lines[(trackPath.findPointIndex(lastPoint) * 2 - LAST_LINE_INDEX_OFFSET
                                          + trackPath.lines.length) % trackPath.lines.length]);
        }
    }

    private addLastLinesBack(lastPoint: Point, lines: Object3D, trackPath: Path): void {
        lines.add(trackPath.lines[(trackPath.findPointIndex(lastPoint) * 2 - 1 + trackPath.lines.length) % trackPath.lines.length]);
        lines.add(trackPath.lines[(trackPath.findPointIndex(lastPoint) * 2 - 2 + trackPath.lines.length) % trackPath.lines.length]);
        if (lastPoint !== trackPath.findLastPoint() || trackPath.isCompleted) {
            lines.add(trackPath.lines[(trackPath.findPointIndex(lastPoint) * 2) % trackPath.lines.length]);
            lines.add(trackPath.lines[(trackPath.findPointIndex(lastPoint) * 2 + 1) % trackPath.lines.length]);
        }
        if (trackPath.findPointIndex(lastPoint) * 2  >= NUMBER_OF_POINTS_FOR_CONSTRAINT * LINES_PER_POINT || trackPath.isCompleted) {
            lines.add(trackPath.lines[(trackPath.findPointIndex(lastPoint) * 2 - BEFORE_LAST_LINE_INDEX_OFFSET
                                       + trackPath.lines.length) % trackPath.lines.length]);
            lines.add(trackPath.lines[(trackPath.findPointIndex(lastPoint) * 2 - LAST_LINE_INDEX_OFFSET
                                       + trackPath.lines.length) % trackPath.lines.length]);

        }
    }

    private calculateLeftOriginVector(originVector: Vector3, directionVector: Vector3): Vector3 {
       return originVector.clone().add((new Vector3(0, 1, 0).cross(directionVector)
       .multiplyScalar(DEFAULT_LINE_WIDTH)));
    }

    private calculateRightOriginVector(originVector: Vector3, directionVector: Vector3): Vector3 {
        return originVector.clone().add((new Vector3(0, 1, 0).cross(directionVector).negate()
        .multiplyScalar(DEFAULT_LINE_WIDTH)));
    }

    private lineLength( firstPoint: Point, secondPoint: Point): number {
        return firstPoint.position.clone().sub(secondPoint.position).length();
    }
}
