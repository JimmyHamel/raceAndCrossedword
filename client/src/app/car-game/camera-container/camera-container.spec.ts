import { OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import * as CAMERA from "./camera-constants";
import { CameraContainer } from "./camera-container";

/* tslint:disable: no-magic-numbers */
const MUCH_FRAMES: number = 300; // 60Fps * 5s

describe("CameraContainer", () => {
    let cameraContainer: CameraContainer;
    let mockCarPosition: Vector3;
    let perspectiveCameraIsActive: boolean;
    let initialVerticalBound: number;
    let initialDistanceFromContainer: number;

    beforeEach(async (done: () => void) => {
        cameraContainer = new CameraContainer(1.77); // 16/9
        mockCarPosition = new Vector3(0, 0, 0);
        done();
    });

    it("should be an Orthographic Camera", () => {
        expect(cameraContainer).toBeDefined();
        expect(cameraContainer.orthographicCamera instanceof OrthographicCamera).toBe(true);
    });

    it("should be a Perspective Camera", () => {
        expect(cameraContainer).toBeDefined();
        expect(cameraContainer.perspectiveCamera instanceof PerspectiveCamera).toBe(true);
    });

    it("should zoom in properly with an orthographic camera", () => {
        expect(cameraContainer).toBeDefined();
        perspectiveCameraIsActive = false;
        initialVerticalBound = CAMERA.DEFAULT_VERTICAL_BOUND;
        cameraContainer.zoomInIsPressed = true;
        cameraContainer.updateCamera(mockCarPosition, perspectiveCameraIsActive);
        expect(cameraContainer.sceneVerticalBound).toBeLessThan(initialVerticalBound);
    });

    it("should zoom in correctly with perspective camera", () => {
        expect(cameraContainer).toBeDefined();
        perspectiveCameraIsActive = true;
        initialDistanceFromContainer = cameraContainer.perspectiveCamera.position.distanceTo(cameraContainer.position);
        cameraContainer.zoomInIsPressed = true;
        cameraContainer.updateCamera(mockCarPosition, perspectiveCameraIsActive);
        expect(cameraContainer.perspectiveCamera.position.distanceTo(cameraContainer.position)).toBeLessThan(initialDistanceFromContainer);
    });

    it("should zoom out properly with an orthographic camera", () => {
        expect(cameraContainer).toBeDefined();
        perspectiveCameraIsActive = false;
        initialVerticalBound = CAMERA.DEFAULT_VERTICAL_BOUND;
        cameraContainer.zoomOutIsPressed = true;
        cameraContainer.updateCamera(mockCarPosition, perspectiveCameraIsActive);
        expect(cameraContainer.sceneVerticalBound).toBeGreaterThan(initialVerticalBound);
    });

    it("should zoom out correctly with perspective camera", () => {
        expect(cameraContainer).toBeDefined();
        perspectiveCameraIsActive = true;
        initialDistanceFromContainer = cameraContainer.perspectiveCamera.position.distanceTo(cameraContainer.position);
        cameraContainer.zoomOutIsPressed = true;
        cameraContainer.updateCamera(mockCarPosition, perspectiveCameraIsActive);
        expect(cameraContainer.perspectiveCamera.position.distanceTo(cameraContainer.position))
              .toBeGreaterThan(initialDistanceFromContainer);
    });

    it("should respect the maximum zoom in with Orthographic camera", () => {
        perspectiveCameraIsActive = false;
        cameraContainer.zoomInIsPressed = true;
        for (let i: number = 0; i < MUCH_FRAMES; i++) {
            cameraContainer.updateCamera(mockCarPosition, perspectiveCameraIsActive);
        }
        expect(cameraContainer.sceneVerticalBound).toBe(CAMERA.MINIMUM_VERTICAL_BOUND);
    });

    it("should respect the maximum zoom out with Orthographic camera", () => {
        perspectiveCameraIsActive = false;
        cameraContainer.zoomOutIsPressed = true;
        for (let i: number = 0; i < MUCH_FRAMES; i++) {
            cameraContainer.updateCamera(mockCarPosition, perspectiveCameraIsActive);
        }
        expect(cameraContainer.sceneVerticalBound).toBe(CAMERA.MAXIMUM_VERTICAL_BOUND);
    });

    it("should respect the maximum zoom in with Perspective camera", () => {
        perspectiveCameraIsActive = true;
        cameraContainer.zoomInIsPressed = true;
        for (let i: number = 0; i < MUCH_FRAMES; i++) {
            cameraContainer.updateCamera(mockCarPosition, perspectiveCameraIsActive);
        }
        expect(cameraContainer.perspectiveCamera.position.distanceTo(cameraContainer.position)).toBe(CAMERA.CLOSEST_DISTANCE_FROM_CAR);
    });

    it("should respect the maximum zoom out with Perspective camera", () => {
        perspectiveCameraIsActive = true;
        cameraContainer.zoomOutIsPressed = true;
        for (let i: number = 0; i < MUCH_FRAMES; i++) {
            cameraContainer.updateCamera(mockCarPosition, perspectiveCameraIsActive);
        }
        expect(cameraContainer.perspectiveCamera.position.distanceTo(cameraContainer.position)).toBe(CAMERA.FARTHEST_DISTANCE_FROM_CAR);
    });
});
