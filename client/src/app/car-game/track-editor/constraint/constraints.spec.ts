import { SegmentAngleConstraint } from "./segment-angle.constraint";
import { SegmentsTouchingConstraint } from "./segments-touching.constraint";
import { WidthLengthConstraint } from "./width-length.constraint";

import { Point } from "../point";
/* tslint:disable: no-magic-numbers */
describe("Constraint", () => {
    const angleConstraint: SegmentAngleConstraint = new SegmentAngleConstraint();
    const lengthConstraint: WidthLengthConstraint = new WidthLengthConstraint();
    const touchingConstraint: SegmentsTouchingConstraint = new SegmentsTouchingConstraint();
    let mockPoint1: Point = new Point(0, 0);
    let mockPoint2: Point = new Point(0, 0);
    let mockPoint3: Point = new Point(0, 0);
    let constraintResult: boolean = false;

    beforeEach(() => {
        mockPoint1 = new Point(0, 0);
        mockPoint2 = new Point(0, 0);
        mockPoint3 = new Point(0, 0);
    });

    it("should construct the segment angle constraint correctly", () => {
        expect (angleConstraint).toBeTruthy();
    });

    it("should construct the segment width/length constraint correctly", () => {
        expect (lengthConstraint).toBeTruthy();
    });

    it("should construct the segment touching constraint correctly", () => {
        expect (touchingConstraint).toBeTruthy();
    });

    it("Points in a straight line should have a correct angle", () => {
        mockPoint1.updatePosition(0, 0);
        mockPoint2.updatePosition(4, 0);
        mockPoint3.updatePosition(8, 0);
        mockPoint1.next = mockPoint2;
        mockPoint2.previous = mockPoint1;
        mockPoint2.next = mockPoint3;
        mockPoint3.previous = mockPoint2;
        constraintResult = angleConstraint.isRespected(mockPoint2);
        expect(constraintResult).toBe(true);
    });

    it("Points with a ninety degree angle should pass the angle constraint", () => {
        mockPoint1.updatePosition(0, 0);
        mockPoint2.updatePosition(4, 0);
        mockPoint3.updatePosition(4, 4);
        mockPoint1.next = mockPoint2;
        mockPoint2.previous = mockPoint1;
        mockPoint2.next = mockPoint3;
        mockPoint3.previous = mockPoint2;
        constraintResult = angleConstraint.isRespected(mockPoint2);
        expect(constraintResult).toBe(true);
    });

    it("Points sharing the same coordinates shouldnt have a correct angle", () => {
        mockPoint1.updatePosition(0, 0);
        mockPoint2.updatePosition(0, 0);
        mockPoint3.updatePosition(0, 0);
        mockPoint1.next = mockPoint2;
        mockPoint2.previous = mockPoint1;
        mockPoint2.next = mockPoint3;
        mockPoint3.previous = mockPoint2;
        constraintResult = angleConstraint.isRespected(mockPoint2);
        expect(constraintResult).toBe(false);
    });

    it("Points sharing the same coordinates shouldnt have a sufficient length", () => {
        mockPoint1.updatePosition(0, 0);
        mockPoint2.updatePosition(0, 0);
        mockPoint1.next = mockPoint2;
        mockPoint2.previous = mockPoint1;
        constraintResult = lengthConstraint.isRespected(mockPoint2);
        expect(constraintResult).toBe(false);
    });

    it("Points forming a vector with a length over 40 should have a sufficient length", () => {
        mockPoint1.updatePosition(0, 0);
        mockPoint2.updatePosition(35, 35);
        mockPoint1.next = mockPoint2;
        mockPoint2.previous = mockPoint1;
        constraintResult = lengthConstraint.isRespected(mockPoint2);
        expect(constraintResult).toBe(true);
    });

    it("Points forming a vector with a length equal to 40 should have a sufficient length", () => {
        mockPoint1.updatePosition(0, 0);
        mockPoint2.updatePosition(40, 0);
        mockPoint1.next = mockPoint2;
        mockPoint2.previous = mockPoint1;
        constraintResult = lengthConstraint.isRespected(mockPoint2);
        expect(constraintResult).toBe(true);
    });

    it("Points forming a vector with a length under 40 shouldnt have a sufficient length", () => {
        mockPoint1.updatePosition(0, 0);
        mockPoint2.updatePosition(10, 0);
        mockPoint1.next = mockPoint2;
        mockPoint2.previous = mockPoint1;
        constraintResult = lengthConstraint.isRespected(mockPoint2);
        expect(constraintResult).toBe(false);
    });
});
