import { Intersection, Raycaster, Vector3, Object3D } from "three";
import { GameScene } from "../scenes/game-scene";
import { Car } from "../car/car";
import { Path } from "../track-editor/path";
import { TOWARDS_GROUND, NUMBER_OF_CAR_CORNERS, CIRCLE_RADIUS } from "../constants";
import { OrientedBoundingRectangle } from "./oriented-bounding-rectangle";
import { RigidBody } from "../car/rigid-body";
import { Point } from "../track-editor/point";
import { LapService } from "../lap-manager/lap.service";
import { Checkpoint } from "../lap-manager/checkpoint";
import { Offroad } from "../render-service/offroad";

const RAYCAST_FAR: number = 20;
const RAYCAST_HEIGHT: number = 5;
export class OffroadHandler extends Object3D {
    private _offroad: Offroad;
    private _cars: Car[];
    private _path: Path;
    private _lineRectangles: OrientedBoundingRectangle[];

    public constructor(newScene: GameScene, private lapService: LapService) {
        super();
        this._offroad = new Offroad();
        this.add(this._offroad);
        this._cars = newScene.cars;
        this._path = newScene.path;
        this._lineRectangles = [];
        for (const line of this._path.lines) {
            this._lineRectangles.push(new OrientedBoundingRectangle(undefined, line));
        }
    }

    public update(): void {
        for (const car of this._cars) {
            if (this.isOffTheRoad(car)) {
                car.wallCollisionSound.ajustVolume(car.speed.length());
                car.wallCollisionSound.play();
                this.handleWallCollision(car.body, this.findNormals(car), this.findContactPoints(car), 0);
            }
        }
    }

    private isOffTheRoad(carToCheck: Car): boolean {
        const intersects: Intersection[][] = this.raycastAllCorners(carToCheck);
        let isOffside: boolean = false;
        if (this.carIsTotallyOffroad(intersects)) {
            this.placeCarAtCheckpoint(carToCheck);

            return false;
        }

        for (const intersect of intersects) {
            if (intersect.length === 1) {
                isOffside = true;
            }
        }

        return isOffside;
    }

    private placeCarAtCheckpoint(car: Car): void {
        const currentCheckpoint: Checkpoint = this.lapService.getCarCurrentCheckpoint(car);
        if (currentCheckpoint) {
            car.meshPosition = currentCheckpoint.point.position.clone();
            const segment: Vector3 = currentCheckpoint.next.point.position.clone().sub(currentCheckpoint.point.position);
            car.angle = Math.atan2(segment.z, -segment.x);
        } else {
            car.meshPosition = new Vector3();
            car.angle = 0;
        }
        car.setSpeed(new Vector3());
    }

    private cornerRaycast(corner: Vector3): Intersection[] {
        corner.setY(RAYCAST_HEIGHT);

        return new Raycaster(corner, TOWARDS_GROUND, 0, RAYCAST_FAR)
            .intersectObject(this._path, true).concat(new Raycaster(corner, TOWARDS_GROUND, 0, RAYCAST_FAR)
                .intersectObject(this._offroad, true));

    }

    private raycastAllCorners(carToCheck: Car): Intersection[][] {
        const intersects: Intersection[][] = [];

        for (const corner of carToCheck.boundingRectangle.getCorners()) {
            intersects.push(this.cornerRaycast(corner));
        }

        return intersects;
    }

    private findNormals(carToCheck: Car): Vector3[] {
        const normals: Vector3[] = [];
        for (let i: number = 0; i < this._lineRectangles.length; i++) {
            if (carToCheck.boundingRectangle.intersect(this._lineRectangles[i])) {
                normals.push(this.normalTowardsRoad(this._lineRectangles[i], this._path.points[Math.floor(i / 2)]));
            }
        }

        for (const circle of this._path.points) {
            for (const corner of carToCheck.boundingRectangle.getCorners()) {
                if (new Vector3(corner.x - circle.positionX, 0, corner.z - circle.positionZ).length() <= CIRCLE_RADIUS * 2) {
                    const offroadPoint: Vector3 = this.getOffroadPoint(corner);
                    if (offroadPoint) {
                        normals.push(new Vector3(circle.positionX - offroadPoint.x, 0, circle.positionZ - offroadPoint.z).normalize());
                    }
                }
            }
        }

        return normals;
    }

    public findContactPoints(carToCheck: Car): Vector3[] {
        const contacts: Vector3[] = [];
        for (const rectangle of this._lineRectangles) {
            if (carToCheck.boundingRectangle.intersect(rectangle)) {
                contacts.push(carToCheck.boundingRectangle.findIntersectionPoints(rectangle));
            }
        }

        for (const circle of this._path.points) {
            for (const corner of carToCheck.boundingRectangle.getCorners()) {
                if (new Vector3(corner.x - circle.positionX, 0, corner.z - circle.positionZ).length() <= CIRCLE_RADIUS * 2) {
                    const offroadPoint: Vector3 = this.getOffroadPoint(corner);
                    if (offroadPoint) {
                        contacts.push(offroadPoint);
                    }
                }
            }
        }

        return contacts;
    }

    private carIsTotallyOffroad(intersect: Intersection[][]): boolean {
        let carCornersOffroad: number = 0;
        if (intersect && intersect !== null) {
            for (const intersection of intersect) {
                if (intersection.length === 1) {
                    carCornersOffroad++;
                }
            }
        }

        return (carCornersOffroad === NUMBER_OF_CAR_CORNERS);
    }

    private normalTowardsRoad(rectangle: OrientedBoundingRectangle, roadPoint: Point): Vector3 {
        const distFromXToRoad: number = rectangle.center.add(rectangle.xLocalAxis)
            .distanceToSquared(new Vector3(roadPoint.positionX, 0, roadPoint.positionZ));
        const distFromMinusXToRoad: number = rectangle.center.add(rectangle.xLocalAxis.negate())
            .distanceToSquared(new Vector3(roadPoint.positionX, 0, roadPoint.positionZ));

        return (distFromXToRoad < distFromMinusXToRoad) ? rectangle.xLocalAxis : rectangle.xLocalAxis.negate();
    }

    private handleWallCollision(body: RigidBody, normals: Vector3[], contactPoints: Vector3[], elasticity: number): void {
        for (const i in normals) {
            if (contactPoints[i]) {
                const normal: Vector3 = normals[i];
                const initialSpeed: Vector3 = body.speed;
                const angularSpeed: Vector3 = new Vector3(0, body.angularSpeed, 0);
                const distToContact: Vector3 = contactPoints[i].clone().sub(body.position);
                const initialContactSpeed: Vector3 = initialSpeed.clone().add(angularSpeed.clone().cross(distToContact));
                if (initialContactSpeed.dot(normal) < 0) {
                    const distACrossN: Vector3 = distToContact.clone().cross(normal);

                    const impulse: number = -((elasticity + 1) * initialContactSpeed.dot(normal)) /
                        ((1 / body.mass) + (distACrossN.dot(distACrossN) / body.inertia));
                    body.speed = initialSpeed.add(normal.clone().multiplyScalar(impulse / body.mass));
                    body.angularSpeed = angularSpeed.add(distToContact.cross(normal.clone().multiplyScalar(impulse))
                        .divideScalar(body.inertia)).y;
                }
            }
        }
    }

    private getOffroadPoint(corner: Vector3): Vector3 {
        const raycast: Raycaster = new Raycaster(corner, TOWARDS_GROUND);
        const intersection: Intersection[] = raycast.intersectObjects([this._path, this._offroad], true);
        if (intersection.length === 1) {
            return intersection[0].point;
        } else {
            return undefined;
        }
    }

    public get offroad(): Offroad {
        return this._offroad;
    }
}
