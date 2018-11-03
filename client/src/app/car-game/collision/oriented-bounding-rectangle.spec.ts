import { Car } from "../car/car";
import { Vector3 } from "three";

/* tslint:disable: no-magic-numbers */
describe("OrientedBoundingRectangle", () => {
    let mockCar1: Car;
    let mockCar2: Car;

    beforeEach(async (done: () => void) => {
        mockCar1 = new Car();
        await mockCar1.init();
        mockCar2 = new Car();
        await mockCar2.init();
        done();
    });

    it("should be created", () => {
        expect(mockCar1.boundingRectangle).toBeTruthy();
        expect(mockCar2.boundingRectangle).toBeTruthy();
    });

    it("should not detect a collision when there isnt", () => {
        mockCar1.meshPosition = new Vector3(20, 0, 20);
        mockCar2.meshPosition = new Vector3(0, 0, 0);
        mockCar1.update(16.6);
        mockCar2.update(16.6);
        expect(mockCar1.boundingRectangle.intersect(mockCar2.boundingRectangle)).toBe(undefined);
    });

    it("should detect a collision when rectangles overlap", () => {
        mockCar1.meshPosition = new Vector3(1, 0, 0);
        mockCar2.meshPosition = new Vector3(0, 0, 0);
        mockCar1.update(16.6);
        mockCar2.update(16.6);
        expect(mockCar1.boundingRectangle.intersect(mockCar2.boundingRectangle)).toBeTruthy();
    });
});
