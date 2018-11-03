import { Offroad } from "../render-service/offroad";
import { Path } from "../track-editor/path";
import { Point } from "../track-editor/point";
import { Intersection, Raycaster, Vector3, Object3D } from "three";

/* tslint:disable: no-magic-numbers */
describe("Offroad", () => {
    const mockPath: Path = new Path(0, 0);
    const mockOffroad: Offroad = new Offroad();

    it("there should be a difference between a path and the offroad", () => {
        mockOffroad.updateMatrixWorld(true);
        mockPath.addPoint(new Point(40, 0));
        expect(mockPath as Object3D === mockOffroad as Object3D).toBe(false);
    });

    it("should not be a path", () => {
        mockOffroad.updateMatrixWorld(true);
        expect(mockOffroad instanceof Path).toBe(false);
    });

    it("Raycast should detect a difference between the offroad and the path", () => {
        mockOffroad.updateMatrixWorld(true);
        mockPath.addPoint(new Point(80, 0));
        const midPath: Vector3 = new Vector3(20, 20, 0);
        const somewhereNotOnPath: Vector3 = new Vector3(80, 20, 40);
        const yAxis: Vector3 = new Vector3(0, -1, 0);
        const intersectPath: Intersection[] = new Raycaster(midPath, yAxis, 0, 30).intersectObject(mockPath, true);
        const intersectOffroad: Intersection[] = new Raycaster(somewhereNotOnPath, yAxis, 0, 30).intersectObject(mockOffroad, true);
        expect( intersectOffroad[0].object === intersectPath[0].object).toBe(false);
    });

});
