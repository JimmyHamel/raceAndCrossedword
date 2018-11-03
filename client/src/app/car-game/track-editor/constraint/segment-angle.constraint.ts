import { Point } from "../point";
import { Vector3 } from "three";

const COSINE_ONE_QUARTER_PI: number = 0.70710678118;

export class SegmentAngleConstraint {

    public isRespected(selectedPoint: Point): boolean {
        if (!selectedPoint.hasNext() || !selectedPoint.hasPrevious()) {
            return true;
        } else {
            return (this.findCosine(selectedPoint) <= COSINE_ONE_QUARTER_PI);
        }
    }

    private findCosine( center: Point): number {
        const centerToFirst: Vector3 = center.previous.position.clone().sub(center.position);
        const centerToThird: Vector3 = center.next.position.clone().sub(center.position);

        return centerToFirst.dot(centerToThird) / (centerToFirst.length() * centerToThird.length());
    }

}
