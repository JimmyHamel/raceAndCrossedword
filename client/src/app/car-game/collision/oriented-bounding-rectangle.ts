import { Vector3, Line, Geometry } from "three";
import { Car } from "../car/car";
import { CAR_WIDTH, CAR_LENGTH, HALF, Y_AXIS, EPSILON, NUMBER_OF_VERTICES } from "../constants";

const INFINITISEMAL_WIDTH: number = 0.0001;
// formules tirees de http://www.jkh.me/files/tutorials/Separating%20Axis%20Theorem%20for%20Oriented%20Bounding%20Boxes.pdf
export class OrientedBoundingRectangle {
    private _center: Vector3;
    private _xLocalAxis: Vector3;
    private _zLocalAxis: Vector3;
    private _halfWidth: number;
    private _halfLength: number;
    private _calculatedNormals: Vector3[];

    public constructor(car?: Car, line?: Line) {
        this._calculatedNormals = [];
        if (car) {
            this._center = car.meshPosition;
            this._zLocalAxis = car.direction.clone().normalize();
            this._xLocalAxis = this._zLocalAxis.clone().cross(Y_AXIS).normalize();
            this._halfLength = CAR_LENGTH * HALF;
            this._halfWidth = CAR_WIDTH * HALF;
        } else {
            const lineGeometry: Geometry = line.geometry as Geometry;
            this._zLocalAxis = lineGeometry.vertices[1].clone().sub(lineGeometry.vertices[0].clone());
            this._xLocalAxis = this._zLocalAxis.clone().cross(Y_AXIS).normalize();
            this._center = lineGeometry.vertices[0].clone().add(this.zLocalAxis.clone().multiplyScalar(HALF));
            this._halfLength = this._zLocalAxis.length() * HALF;
            this._zLocalAxis.normalize();
            this._halfWidth = INFINITISEMAL_WIDTH;
        }
    }

    public update(car: Car): void {
        this._center = car.meshPosition.clone();
        this._zLocalAxis = car.direction.clone().normalize();
        this._xLocalAxis = this._zLocalAxis.clone().cross(Y_AXIS).normalize();
    }

    public intersect(otherRectangle: OrientedBoundingRectangle): Vector3 {
        const axisToCheck: Vector3[] = this.buildAxisArray(otherRectangle);
        // vecteur qui va du milieu d'un rectangle a l'autre -> on utilise la propriete des rectangles
        // disant que lorsque coupe en son centre, les parties resultantes ont des dimensions equivalentes
        // ce vecteur va de l'autre rectangle a celui-ci
        const vectorBetweenCars: Vector3 = this._center.clone().sub(otherRectangle.center.clone());
        let minOverlap: number = Infinity;
        let minTranslationAxis: Vector3 = new Vector3();
        for (const axis of axisToCheck) {
            const distanceBetweenCars: number = this.distanceBetweenCarsOnAxis(vectorBetweenCars, axis);
            const carsDimensions: number = this.carsDimensionsOnAxis(otherRectangle, axis);
            if (distanceBetweenCars > carsDimensions) {
                return undefined;
            } else {
                const overlap: number = carsDimensions - distanceBetweenCars;
                if (overlap < minOverlap) {
                    minOverlap = overlap;
                    minTranslationAxis = axis;
                }
            }
        }

        if (minTranslationAxis.dot(vectorBetweenCars) < 0) {
            minTranslationAxis.negate();
        }

        return minTranslationAxis.clone().multiplyScalar(minOverlap);
    }

    private buildAxisArray(otherRectangle: OrientedBoundingRectangle): Vector3[] {
        const axisArray: Vector3[] = [];
        axisArray.push(this._xLocalAxis);
        axisArray.push(this._zLocalAxis);
        axisArray.push(otherRectangle.xLocalAxis);
        axisArray.push(otherRectangle.zLocalAxis);

        return axisArray;
    }

    private carsDimensionsOnAxis(otherRectangle: OrientedBoundingRectangle, axis: Vector3): number {
        return this.projectDimensionOnAxis(otherRectangle.xLocalAxis, otherRectangle.halfWidth, axis) +
            this.projectDimensionOnAxis(otherRectangle.zLocalAxis, otherRectangle.halfLength, axis) +
            this.projectDimensionOnAxis(this.xLocalAxis, this.halfWidth, axis) +
            this.projectDimensionOnAxis(this.zLocalAxis, this.halfLength, axis);
    }

    private projectDimensionOnAxis(dimensionDirection: Vector3, dimensionSize: number, axis: Vector3): number {
        // la dimension est la largeur ou la longueur du rectangle projetee sur l'axe en parametre
        const dimension: Vector3 = dimensionDirection.clone().multiplyScalar(dimensionSize);

        return Math.abs(dimension.dot(axis.clone()));
    }

    private distanceBetweenCarsOnAxis(vectorBetweenCars: Vector3, axis: Vector3): number {
        return Math.abs(vectorBetweenCars.dot(axis.clone()));
    }

    public get xLocalAxis(): Vector3 {
        return this._xLocalAxis.clone();
    }

    public get zLocalAxis(): Vector3 {
        return this._zLocalAxis.clone();
    }

    public get center(): Vector3 {
        return this._center.clone();
    }

    public get halfWidth(): number {
        return this._halfWidth;
    }

    public get halfLength(): number {
        return this._halfLength;
    }

    public get calculatedNormals(): Vector3[] {
        return this._calculatedNormals;
    }

    public getFrontRightCorner(): Vector3 {
        return this.center.add(this.xLocalAxis.multiplyScalar(this.halfWidth)).add(this.zLocalAxis.multiplyScalar(this.halfLength));
    }

    public getFrontLeftCorner(): Vector3 {
        return this.center.sub(this.xLocalAxis.multiplyScalar(this.halfWidth)).add(this.zLocalAxis.multiplyScalar(this.halfLength));
    }

    public getRearRightCorner(): Vector3 {
        return this.center.add(this.xLocalAxis.multiplyScalar(this.halfWidth)).sub(this.zLocalAxis.multiplyScalar(this.halfLength));
    }

    public getRearLeftCorner(): Vector3 {
        return this.center.sub(this.xLocalAxis.multiplyScalar(this.halfWidth)).sub(this.zLocalAxis.multiplyScalar(this.halfLength));
    }

    public getCorners(): Vector3[] {
        const corners: Vector3[] = [];
        corners.push(this.getFrontLeftCorner());
        corners.push(this.getFrontRightCorner());
        corners.push(this.getRearRightCorner());
        corners.push(this.getRearLeftCorner());

        return corners;
    }

    public findIntersectionPoints(otherRectangle: OrientedBoundingRectangle): Vector3 {
        const intersectionPoints: Vector3[] = [];
        this._calculatedNormals = [];
        for (let i: number = 0; i < NUMBER_OF_VERTICES; i++) {
            const direction: Vector3 = this.getCorners()[(i + 1) % NUMBER_OF_VERTICES].clone().sub(this.getCorners()[i]);
            for (let j: number = 0; j < NUMBER_OF_VERTICES; j++) {
                const otherDirection: Vector3 = otherRectangle.getCorners()[(j + 1) % NUMBER_OF_VERTICES].clone()
                    .sub(otherRectangle.getCorners()[j]);
                const directionCrossOtherDirection: number = direction.clone().cross(otherDirection).y;
                const startingPointsDistance: Vector3 = otherRectangle.getCorners()[j].clone().sub(this.getCorners()[i]);
                const startingPointsDistanceCrossDirection: number = startingPointsDistance.clone().cross(direction).y;
                if (Math.abs(directionCrossOtherDirection) <= EPSILON && Math.abs(startingPointsDistanceCrossDirection) <= EPSILON) {
                    intersectionPoints.concat(
                        this.calculateCollinearIntersection(startingPointsDistance, direction, otherDirection, this.getCorners()[i]));
                } else if (Math.abs(directionCrossOtherDirection) >= EPSILON) {
                    const scalarIntersectionDistance: number = startingPointsDistanceCrossDirection /
                        (directionCrossOtherDirection);
                    const otherScalarIntersectionDistance: number = startingPointsDistance.clone().cross(direction).y /
                        (directionCrossOtherDirection);
                    if (this.isWithinInterval(scalarIntersectionDistance, 0, 1)
                        && this.isWithinInterval(otherScalarIntersectionDistance, 0, 1)) {
                        this._calculatedNormals.push((otherDirection.clone().cross(Y_AXIS.clone())).normalize());
                        intersectionPoints.push(this.getCorners()[i].clone().add(direction.multiplyScalar(scalarIntersectionDistance)));
                    }
                }
            }
        }

        return this.calculateAverageVector(intersectionPoints);
    }

    private calculateCollinearIntersection(startingPointsDistance: Vector3, direction: Vector3,
                                           otherDirection: Vector3, corner: Vector3): Vector3[] {
        const intersectionPoints: Vector3[] = [];
        const scalarIntersectionStart: number = startingPointsDistance.dot(direction) / direction.dot(direction);
        const scalarIntersectionEnd: number = scalarIntersectionStart +
            otherDirection.dot(direction) / direction.dot(direction);
        const intersectionScalars: number[] = otherDirection.dot(direction) < 0 ?
            this.findIntervalIntersection(scalarIntersectionEnd, scalarIntersectionStart, 0, 1) :
            this.findIntervalIntersection(scalarIntersectionStart, scalarIntersectionEnd, 0, 1);

        if (intersectionScalars.length > 0) {
            this._calculatedNormals.push((otherDirection.clone().cross(Y_AXIS.clone())).normalize());
            for (const k of intersectionScalars) {
                intersectionPoints.push(corner.clone().add(direction.multiplyScalar(intersectionScalars[k])));
            }
        }

        return intersectionPoints;
    }

    private isWithinInterval(value: number, min: number, max: number): boolean {
        return value >= min && value <= max;
    }

    private findIntervalIntersection(a: number, b: number, c: number, d: number): number[] {
        if (a < b && b < c && c < d) {
            return [c, d];
        } else if (c < a && a < b && b < d) {
            return [a, b];
        } else if (c < a && a < d && d < b) {
            return [a, d];
        } else if (a < c && c < b && b < d) {
            return [b, c];
        } else {
            return [];
        }
    }

    private calculateAverageVector(vectors: Vector3[]): Vector3 {
        const averageVector: Vector3 = new Vector3();
        for (const vector of vectors) {
            averageVector.add(vector);
        }

        return averageVector.divideScalar(vectors.length);
    }

}
