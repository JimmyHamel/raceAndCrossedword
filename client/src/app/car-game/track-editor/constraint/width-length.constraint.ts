import { Point } from "../point";
import { DEFAULT_LINE_WIDTH } from "../../constants";

const LENGTH_WIDTH_RATIO: number = 2;

export class WidthLengthConstraint {
    public isRespected(selectedPoint: Point): boolean {
        if (selectedPoint.hasPrevious()) {
            return (this.lineLength(selectedPoint, selectedPoint.previous) >= (LENGTH_WIDTH_RATIO * DEFAULT_LINE_WIDTH));
        } else {
            return true;
        }
    }

    private lineLength( firstPoint: Point, secondPoint: Point): number {
        return firstPoint.position.clone().sub(secondPoint.position).length();
    }
}
