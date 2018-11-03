import { MeshBasicMaterial, Mesh, SphereGeometry, Object3D, CircleGeometry, Color } from "three";
import { PI_OVER_2, CIRCLE_RADIUS } from "../constants";

const OUTLINE_COLOR: number = 0x000000;
const STARTING_POINT_COLOR: number = 0xFFFFFF;
const REGULAR_COLOR: number = 0xFF3838;
const OUTLINE_EXTRA_RADIUS: number = 1;
const NB_SEGMENTS: number = 20;
const STARTING_Y_POSITION: number = 0.5;

export class Point extends Object3D {
    private _next: Point;
    private _previous: Point;
    private _isFirstPoint: boolean;
    public constructor(positionX: number, positionZ: number, isFirstPoint: boolean = false) {
        super();
        this._next = null;
        this._previous = null;
        this._isFirstPoint = isFirstPoint;
        const material: MeshBasicMaterial = new MeshBasicMaterial({ color: REGULAR_COLOR });
        if (isFirstPoint) {
            this.changeColorFirstPoint(material);
        }
        this.add(new Mesh(new SphereGeometry(CIRCLE_RADIUS, NB_SEGMENTS, NB_SEGMENTS), material));
        this.updatePosition(positionX, positionZ);
    }

    private changeColorFirstPoint(material: MeshBasicMaterial): void {
        material.color = new Color(STARTING_POINT_COLOR);
        const startingCircleMesh: Mesh = new Mesh(new CircleGeometry(CIRCLE_RADIUS + OUTLINE_EXTRA_RADIUS, NB_SEGMENTS),
                                                  new MeshBasicMaterial({ color: OUTLINE_COLOR }));
        startingCircleMesh.position.y = STARTING_Y_POSITION;
        startingCircleMesh.rotateX(-PI_OVER_2);
        this.add(startingCircleMesh);
    }

    public updatePosition(positionX: number, positionZ: number): void {
        this.position.set(positionX, 0, positionZ);
    }

    public get isFirstPoint(): boolean {
        return this._isFirstPoint;
    }

    public get positionX(): number {
        return this.position.x;
    }

    public get positionZ(): number {
        return this.position.z;
    }

    public get next(): Point {
        return this._next;
    }

    public set next(point: Point) {
        this._next = point;
    }

    public get previous(): Point {
        return this._previous;
    }

    public set previous(point: Point) {
        this._previous = point;
    }

    public hasNext(): boolean {
        return (this._next !== null);
    }

    public hasPrevious(): boolean {
        return (this._previous !== null);
    }
}
