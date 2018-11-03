import { Point } from "./point";
import { Object3D, Geometry, Line, Mesh, Face3, Color, CircleGeometry, LineBasicMaterial, MeshPhongMaterial, DoubleSide } from "three";
import { Segment, SegmentLine, LinePoint } from "./segment";
import { PI_OVER_2, CIRCLE_RADIUS, CIRCLE_SEGMENTS, DEFAULT_LINE_WIDTH, VERTICES_PER_PLANES } from "../constants";
const THIRD_VERTICE: number = 3;
const LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: 0x0000FF, linewidth: DEFAULT_LINE_WIDTH });
const MESH_PLANE_MATERIAL: MeshPhongMaterial = new MeshPhongMaterial({ color: new Color(0, 0, 1), side: DoubleSide });
export class Path extends Object3D {
    private _lines: Line[];
    private _lineContainer: Object3D;
    private _points: Point[];
    private _planes: Mesh[];
    private _isCompleted: boolean;

    public constructor(initialX: number = 0, initialY: number = 0, points?: Point[]) {
        super();
        this._lines = [];
        this._points = [];
        this._planes = [];
        this._isCompleted = false;
        this._lineContainer = new Object3D();
        this.add(this._lineContainer);
        this.manageInitPoints(points, initialX, initialY);
    }

    private manageInitPoints(points: Point[], initialX: number, initialY: number): void {
        if (this.canBeBuiltWithPoints(points)) {
            this.buildWithPoint(points);
        } else {
            this.buildWithoutPoint(initialX, initialY);
        }
    }

    private canBeBuiltWithPoints(points: Point[]): boolean {
        if (points !== null && points) {
            if (points.length >= 1) {
                return true;
            }
        }

        return false;
    }

    private buildWithoutPoint(initialX: number, initialY: number): void {
        this.points.push(new Point(initialX, initialY, true));
        this.add(this.findFirstPoint());
    }

    private buildWithPoint(points: Point[]): void {
        this._points.push(new Point(points[0].positionX, points[0].positionZ, true));
        this.add(this.findFirstPoint());
        for (let i: number = 1; i < points.length - 1; i++) {
            this.addPoint(points[i]);
        }
        this.addPoint(this.findFirstPoint());
        this._isCompleted = true;
    }

    private createNewLine(segment: Segment, index: SegmentLine): void {
        const lineGeometry: Geometry = new Geometry();
        lineGeometry.vertices.push(segment.lines[index][LinePoint.firstPoint]);
        lineGeometry.vertices.push(segment.lines[index][LinePoint.secondPoint]);
        lineGeometry.verticesNeedUpdate = true;
        const line: Line = new Line(lineGeometry, LINE_MATERIAL);
        line.geometry.computeBoundingSphere();
        this._lineContainer.add(line);
        this._lines.push(line);
    }
    private createNewPlane(segment: Segment): void {
        const plane: Geometry = new Geometry();
        plane.vertices.push(segment.lines[0][0], segment.lines[0][1], segment.lines[1][0], segment.lines[1][1]);
        plane.faces.push(
            new Face3(0, 1, THIRD_VERTICE),
            new Face3(THIRD_VERTICE, 2, 0)
        );
        plane.computeFaceNormals();
        this._planes.push(new Mesh(plane, MESH_PLANE_MATERIAL));
        this.add(this._planes[this._planes.length - 1]);
    }

    public addPoint(point: Point): void {
        if (this._points.length > 0) {
           const newSegment: Segment = new Segment(this._points[this._points.length - 1], point);
           this.createNewLine(newSegment, SegmentLine.firstLine);
           this.createNewLine(newSegment, SegmentLine.secondLine);
           this.createNewPlane(newSegment);
        }

        if (point.isFirstPoint) {
            this.findLastPoint().next = this.findFirstPoint();
            this.findFirstPoint().previous = this.findLastPoint();
            this._isCompleted = true;
        } else {
            this.add(point);
            point.previous = this.findLastPoint();
            this.findLastPoint().next = point;
            this._points.push(point);
        }
    }

    public removeLastPoint(): void {
        this._lineContainer.remove(this._lines.pop());
        this._lineContainer.remove(this._lines.pop());
        this.remove(this._planes.pop());
        if (this.findFirstPoint() === this.findLastPoint()) {
            this._isCompleted = false;
            if (this._points.length > 1) {
                this.findFirstPoint().previous = null;
                this.findLastPoint().next = null;
            } else {
                this.remove(this.findLastPoint());
                this._points.pop();
            }
        } else {
            this.remove(this.findLastPoint());
            this._points.pop();
            this.findLastPoint().next = null;
        }
    }

    private manageMovingUncompleteTrackPoints(point: Point, positionX: number, positionZ: number, index: number): void {
        if (point !== this.findLastPoint()) {
            this.updateSegment(index, 0, positionX, positionZ);
            }
        if (!point.isFirstPoint) {
            this.updateSegment(index, 1, positionX, positionZ);
        }
    }

    public movePoint(point: Point, positionX: number, positionZ: number): void {
        point.updatePosition(positionX, positionZ);
        const lineIndex: number = this.findPointIndex(point);
        if (!this._isCompleted) {
            this.manageMovingUncompleteTrackPoints(point, positionX, positionZ, lineIndex);
        } else {
            if (point.isFirstPoint) {
                this.moveStartingPoint(positionX, positionZ);
            } else if (point === this.findFirstPoint().previous) {
                this.moveLastPoint(positionX, positionZ);
            } else {
                this.manageMovingUncompleteTrackPoints(point, positionX, positionZ, lineIndex);
            }
        }
    }
    private moveStartingPoint(positionX: number, positionZ: number): void {
        const segment1: Segment = new Segment(this.findFirstPoint(), this.findFirstPoint().next);
        const segment2: Segment = new Segment(this.findFirstPoint().previous, this.findFirstPoint());
        this.updateLines(segment1, 0, 0);
        this.updatePlane(0, 0, segment1);
        this.updateLines(segment2, this.points.length, 1);
        this.updatePlane(this._planes.length - 1, 0, segment2);
    }
    private moveLastPoint(positionX: number, positionZ: number): void {
        const segment1: Segment = new Segment(this.findFirstPoint().previous, this.findFirstPoint());
        const segment2: Segment = new Segment(this.findFirstPoint().previous.previous, this.findFirstPoint().previous);
        this.updateLines(segment1, this.points.length - 1, 0);
        this.updatePlane(this._planes.length - 1, 0, segment1);
        this.updateLines(segment2, this.points.length - 1, 1);
        this.updatePlane(this._planes.length - 2, 0, segment2);
    }
    private updateSegment(lineIndex: number, offset: number, positionX: number, positionZ: number): void {
        const segment: Segment = (offset === 0) ? new Segment(this.points[lineIndex % this._points.length],
                                                              this.points[(lineIndex + 1 + this._points.length) % this._points.length]) :
                                                  new Segment(this.points[(lineIndex - 1 + this._points.length) % this.points.length],
                                                              this.points[lineIndex % this._points.length]);
        this.updateLines(segment, lineIndex, offset);
        this.updatePlane(lineIndex, offset, segment);
    }
    private updateLines(segment: Segment, lineIndex: number, offset: number): void {
        this.recreateLine(segment, lineIndex, offset, 1);
        this.recreateLine(segment, lineIndex, offset, 0);
    }
    private recreateLine(segment: Segment, lineIndex: number, offset: number, lineNumber: number): void {
        const lineGeometry1: Geometry = new Geometry();
        lineGeometry1.vertices.push(segment.lines[0][LinePoint.firstPoint]);
        lineGeometry1.vertices.push(segment.lines[0][LinePoint.secondPoint]);
        lineGeometry1.verticesNeedUpdate = true;
        const line1: Line = new Line(lineGeometry1, LINE_MATERIAL);
        line1.geometry.computeBoundingSphere();
        this._lineContainer.remove(this._lines[(lineIndex - offset) * 2 + lineNumber]);
        this._lineContainer.add(line1);
        this._lines[(lineIndex - offset) * 2 + lineNumber] = line1;
    }
    private updatePlane(lineIndex: number, offset: number, segment: Segment): void {
        for (let i: number = 0; i < VERTICES_PER_PLANES; i++) {
            (this._planes[lineIndex - offset].geometry as Geometry).vertices[i]
                .set(segment.lines[Math.floor(i / 2)][i % 2].x, 0, segment.lines[Math.floor(i / 2)][i % 2].z);
        }
        (this._planes[lineIndex - offset].geometry as Geometry).verticesNeedUpdate = true;
    }
    public findPointIndex(point: Point): number {
        for (let index: number = 0; index < this.numberOfPoints; index++) {
            if (point === this._points[index]) {
                return index;
            }
        }

        return null;
    }
    public updateColorIllegalLines(illegalLines: Line[]): void {
        for (const plane of this._planes) {
            plane.material = new MeshPhongMaterial({ color: new Color(0, 0, 1) });
            plane.material.needsUpdate = true;
        }
        for (const line of illegalLines) {
            const lineToPlaneIndexConverstion: number = Math.floor(this._lines.indexOf(line) / 2);
            this._planes[lineToPlaneIndexConverstion].material =
                new MeshPhongMaterial(({ color: new Color(1, 0, 0) }));
            (this._planes[lineToPlaneIndexConverstion].geometry as Geometry).colorsNeedUpdate = true;
        }
    }

    public removePoints(): void {
        for (const point of this._points) {
            this.remove(point);
        }
    }
    public removeLines(): void {
        for (const line of this._lines) {
            this.remove(line);
        }
        this.remove(this.lineContainer);
    }
    public addCircles(): void {
        if (this._points !== null && this._points && this.isCompleted) {
            for (let point of this._points) {
                const circleGeometry: CircleGeometry = new CircleGeometry(CIRCLE_RADIUS, CIRCLE_SEGMENTS);
                const circleMaterial: MeshPhongMaterial = new MeshPhongMaterial({ color: new Color(0, 0, 1) });
                const circleMesh: Mesh = new Mesh(circleGeometry, circleMaterial);
                circleMesh.rotateX(-PI_OVER_2);
                circleMesh.position.set(point.positionX, 0, point.positionZ);
                this.add(circleMesh);
                point = null;
            }
        }
    }

    public get isCompleted(): boolean {
        return this._isCompleted;
    }

    public get lineContainer(): Object3D {
        return this._lineContainer;
    }

    public get numberOfPoints(): number {
        return this._points.length;
    }

    public get points(): Point[] {
        return this._points;
    }

    public get lines(): Line[] {
        return this._lines;
    }
    public get planes(): Mesh[] {
        return this._planes;
    }
    public findFirstPoint(): Point {
        return this._points[0];
    }
    public findLastPoint(): Point {
        if (this._isCompleted) {
            return this.findFirstPoint();
        } else {
            return this._points[this._points.length - 1];
        }
    }
}
