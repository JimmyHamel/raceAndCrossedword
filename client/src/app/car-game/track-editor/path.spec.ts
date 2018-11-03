import { Path } from "./path";
import { Point } from "./point";

/* tslint:disable:no-magic-numbers*/
describe("Path", () => {
    let path: Path;
    let point: Point;

    beforeEach(() => {
    });

    it("Path should be created", () => {
        expect(path = new Path(0, 0)).toBeTruthy();
    });

    it("Point should be added to Path", () => {
        point = new Point(1, 1);
        path = new Path(0, 0);
        path.addPoint(point);
        expect(path.findLastPoint().position.equals(point.position)).toBe(true);
    });

    it("Two points should be added to Path", () => {
        point = new Point(1, 1);
        path = new Path(0, 0);
        path.addPoint(point);
        point = new Point(2, 2);
        path.addPoint(point);
        expect(path.numberOfPoints).toBe(3);
    });

    it("Point should be removed from Path", () => {
        point = new Point(1, 1);
        path = new Path(0, 0);
        path.addPoint(point);
        path.removeLastPoint();
        expect(path.findLastPoint().position.equals(point.position)).toBe(false);
    });

    it("Only one point should be removed from Path", () => {
        point = new Point(1, 1);
        path = new Path(0, 0);
        path.addPoint(point);
        point = new Point(2, 2);
        path.addPoint(point);
        path.removeLastPoint();
        expect(path.numberOfPoints).toBe(2);
    });

});
