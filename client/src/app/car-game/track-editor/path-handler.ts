import { Vector3, Intersection, Vector2, Raycaster, Object3D, Scene, Mesh, PlaneGeometry, MeshBasicMaterial, Line } from "three";
import { Path } from "./path";
import { Point } from "./point";
import { CameraContainer } from "../camera-container/camera-container";
import { PI_OVER_2 } from "../constants";
import { SegmentAngleConstraint } from "./constraint/segment-angle.constraint";
import { WidthLengthConstraint } from "./constraint/width-length.constraint";
import { SegmentsTouchingConstraint } from "./constraint/segments-touching.constraint";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

const MINIMUM_OFFSET: number = 0.1;
const NO_OF_POINTS_REQUIRED_TO_CHECK_ALL_CONSTRAINTS: number = 2;
const FLOOR_SIDE: number = 500;
const FLOOR_OPACITY: number = 0.5;
const ANGLE_CONSTRAINT: SegmentAngleConstraint = new SegmentAngleConstraint();
const LENGTH_CONSTRAINT: WidthLengthConstraint = new WidthLengthConstraint();
const TOUCHING_CONSTRAINT: SegmentsTouchingConstraint = new SegmentsTouchingConstraint();

export class PathHandler {
    private selectedPoint: Point;
    private lastPosition: Vector3;
    private floor: Mesh;
    private perspectiveCameraIsActive: boolean;
    private illegalLines: Line[];
    private _illegalLinesObserver: Subject<Line[]>;
    private _path: Path;

    public constructor(
        private scene: Scene,
        private cameraContainer: CameraContainer
    ) {

        const geometry: PlaneGeometry = new PlaneGeometry(FLOOR_SIDE, FLOOR_SIDE, 0, 1);
        const material: MeshBasicMaterial = new MeshBasicMaterial({ transparent: true, opacity: FLOOR_OPACITY });
        this.floor = new Mesh(geometry, material);
        this.floor.rotation.set(-PI_OVER_2, 0, 0);
        this.scene.add(this.floor);
        this.selectedPoint = null;
        this.perspectiveCameraIsActive = false;
        this.illegalLines = [];
        this.lastPosition = null;
        this._illegalLinesObserver = new Subject();
        this._illegalLinesObserver.next(this.illegalLines);
    }

    public switchCamera(): void {
        this.perspectiveCameraIsActive = !this.perspectiveCameraIsActive;
    }

    public selectObject(mousePosition: Vector2): void {
        let intersection: Intersection;
        if (this.pathIsStarted()) {
            intersection = this.verifyIntersection(mousePosition, this._path.points);
            this.selectedPoint = (intersection !== null) ? intersection.object.parent as Point : null;
            if (this.selectedPoint !== null) {
                this.lastPosition = this.selectedPoint.position.clone();
            }
        }
    }

    public deselectObject(mousePosition: Vector2): boolean {
        let deltaX: number;
        let deltaZ: number;
        if (this.selectedPoint !== null) {
            deltaX = Math.abs(this.selectedPoint.position.x - this.lastPosition.x);
            deltaZ = Math.abs(this.selectedPoint.position.z - this.lastPosition.z);
        }
        if (this.pathIsStarted() && this.selectedPoint !== null && deltaX < MINIMUM_OFFSET &&
            deltaZ < MINIMUM_OFFSET && !this._path.isCompleted) {
            this.verifyStartingPoint(this.selectedPoint);
        } else {
            if (!this._path || (this.selectedPoint === null && !this._path.isCompleted)) {
                const clickPosition: Intersection = this.verifyIntersection(mousePosition, [this.floor]);
                this.createPoint(clickPosition);
            }

        }
        this.selectedPoint = null;
        this.lastPosition = null;

        return this._path.isCompleted;
    }

    public movePoint(mousePosition: Vector2): void {
        if (this.selectedPoint) {
            const clickPosition: Intersection = this.verifyIntersection(mousePosition, [this.floor]);
            this._path.movePoint(this.selectedPoint, clickPosition.point.x, clickPosition.point.z);
        }
    }
    public removeLastPoint(): boolean {
        this.illegalLines = [];
        if (this.pathIsStarted()) {
            this._path.removeLastPoint();
        }

        return this._path.isCompleted;
    }

    private pathIsStarted(): boolean {
        return this._path && this._path.numberOfPoints > 0;
    }

    private endTrack(startingPoint: Point): void {
        const endingPoint: Point = startingPoint;
        this._path.addPoint(endingPoint);
    }

    public updateIllegalList(): void {
        this.illegalLines = [];
        if (this._path) {
            for (const point of this._path.points) {
                if (!point.isFirstPoint || this._path.isCompleted) {
                    this.constraintsPass(point);
                }
            }
            if (this._path.lines.length > 0) {
                this._path.updateColorIllegalLines(this.illegalLines);
            }
            this._illegalLinesObserver.next(this.illegalLines);
        }
    }

    private constraintsPass(mostRecentPoint: Point): void {

        if (!ANGLE_CONSTRAINT.isRespected(mostRecentPoint)) {
            this.illegalLines.push(this.findLine(mostRecentPoint, 1));
            this.illegalLines.push(this.findLine(mostRecentPoint, 0));
        }
        if (!TOUCHING_CONSTRAINT.isRespected(mostRecentPoint, mostRecentPoint.previous, this._path)) {
            this.illegalLines.push(this.findLine(mostRecentPoint, 1));
        }
        if (!LENGTH_CONSTRAINT.isRespected(mostRecentPoint)) {
            this.illegalLines.push(this.findLine(mostRecentPoint, 1));
        }
    }

    private findLine(mostRecentPoint: Point, offset: number): Line {
        return this._path.lines[(this._path.findPointIndex(mostRecentPoint) * 2 - offset + this._path.lines.length)
            % this._path.lines.length];
    }
    private verifyIntersection(mousePosition: Vector2, objects: Object3D[]): Intersection {
        const raycast: Raycaster = new Raycaster();
        raycast.setFromCamera(
            mousePosition,
            this.cameraContainer.orthographicCamera);

        const intersect: Intersection[] = raycast.intersectObjects(objects, true);
        if (intersect.length > 0) {
            return intersect[0];
        } else {
            return null;
        }
    }

    private verifyStartingPoint(point: Point): void {
        if (point.isFirstPoint && this._path.numberOfPoints > NO_OF_POINTS_REQUIRED_TO_CHECK_ALL_CONSTRAINTS) {
            this.endTrack(this._path.findFirstPoint());
        }
    }

    private createPoint(intersection: Intersection | Point): void {
        if (intersection !== null) {
            this.illegalLines = [];
            const point: Point = this.convertToPoint(intersection);
            if (!this.pathIsStarted()) {
                this._path = new Path(point.positionX, point.positionZ);
                this.lastPosition = new Vector3(point.positionX, 0, point.positionZ);
                this.scene.add(this._path);
            } else {
                this._path.addPoint(point);
            }
        }
    }

    private convertToPoint(intersection: Intersection | Point): Point {
        if (intersection instanceof Point) {
            return new Point(intersection.positionX, intersection.positionZ, !this.pathIsStarted());
        } else {
            return new Point(intersection.point.x, intersection.point.z, !this.pathIsStarted());
        }
    }

    public loadPath(points: Point[]): void {
        this._path = new Path(0, 0, points);
        this.scene.add(this._path);
    }

    public get illegalLinesObserver(): Observable<Line[]> {
        return this._illegalLinesObserver.asObservable();
    }

    public get points(): Point[] {
        return this._path.points;
    }
}
