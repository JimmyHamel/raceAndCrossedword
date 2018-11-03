import { OrthographicCamera, PerspectiveCamera, Object3D, Vector3, Quaternion } from "three";
import * as CAMERA from "./camera-constants";

export class CameraContainer extends Object3D {
    public zoomInIsPressed: boolean;
    public zoomOutIsPressed: boolean;
    private cameraOrthographic: OrthographicCamera;
    private cameraPerspective: PerspectiveCamera;
    private verticalBound: number;
    private maximumVerticalBound: number;

    public constructor(aspectRatio: number = CAMERA.DEFAULT_ASPECT_RATIO, sceneVerticalBound: number = CAMERA.DEFAULT_VERTICAL_BOUND) {
        super();
        this.zoomInIsPressed = false;
        this.zoomOutIsPressed = false;
        this.maximumVerticalBound = CAMERA.MAXIMUM_VERTICAL_BOUND;
        this.verticalBound = sceneVerticalBound;
        this.cameraOrthographic = new OrthographicCamera(
            -this.getHorizontalBound(aspectRatio),
            this.getHorizontalBound(aspectRatio),
            this.verticalBound,
            -this.verticalBound,
            CAMERA.NEAR_CLIPPING_PLANE,
            CAMERA.FAR_CLIPPING_PLANE
        );
        this.cameraPerspective = new PerspectiveCamera(
            CAMERA.FIELD_OF_VIEW,
            aspectRatio,
            CAMERA.NEAR_CLIPPING_PLANE,
            CAMERA.FAR_CLIPPING_PLANE
        );
        this.cameraOrthographic.position.set(0, CAMERA.INITIAL_CAMERA_POSITION_Y, 0);
        this.cameraPerspective.position.set(0, CAMERA.INITIAL_CAMERA_POSITION_Y_PERSPECTIVE, CAMERA.INITIAL_CAMERA_POSITION_Z);
        this.cameraOrthographic.lookAt(this.position);
        this.add(this.cameraOrthographic);
        this.add(this.cameraPerspective);
    }

    public updateCamera(carPosition: Vector3, perspectiveCameraIsActive: boolean, rotation: Quaternion = new Quaternion()): void {
        this.zoom(perspectiveCameraIsActive);
        if (perspectiveCameraIsActive) {
            this.position.set(carPosition.x, 0, carPosition.z);
            this.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
            this.cameraPerspective.updateProjectionMatrix();
        } else {
            this.position.set(carPosition.x, CAMERA.INITIAL_CAMERA_POSITION_Y , carPosition.z);
            this.quaternion.set(0, 0, 0, 0);
            this.cameraOrthographic.left = -this.getHorizontalBound(CAMERA.DEFAULT_ASPECT_RATIO);
            this.cameraOrthographic.right = this.getHorizontalBound(CAMERA.DEFAULT_ASPECT_RATIO);
            this.cameraOrthographic.top = this.verticalBound;
            this.cameraOrthographic.bottom = -this.verticalBound;
            this.cameraOrthographic.updateProjectionMatrix();
        }
    }

    public resize(ratio: number): void {
        this.cameraOrthographic.left = -this.getHorizontalBound(ratio);
        this.cameraOrthographic.right = this.getHorizontalBound(ratio);
        this.cameraOrthographic.updateProjectionMatrix();
        this.cameraPerspective.aspect = ratio;
        this.cameraPerspective.updateProjectionMatrix();
    }

    private zoom(perspectiveCameraIsActive: boolean): void {
        if (this.zoomInIsPressed) {
            if (perspectiveCameraIsActive && this.perspectiveCamera.position.length() > CAMERA.CLOSEST_DISTANCE_FROM_CAR) {
                this.cameraPerspective.position.setLength(this.cameraPerspective.position.length()
                                                          - CAMERA.PERSPECTIVE_ZOOM_INCREMENT);
            } else if (!perspectiveCameraIsActive && this.verticalBound > CAMERA.MINIMUM_VERTICAL_BOUND) {
                this.verticalBound -= CAMERA.ORTHOGRAPHIC_ZOOM_INCREMENT;
            }
        } else if (this.zoomOutIsPressed) {
            if (perspectiveCameraIsActive && this.perspectiveCamera.position.length() < CAMERA.FARTHEST_DISTANCE_FROM_CAR) {
                this.cameraPerspective.position.setLength(this.cameraPerspective.position.length()
                                                          + CAMERA.PERSPECTIVE_ZOOM_INCREMENT);
            } else if (!perspectiveCameraIsActive && this.verticalBound < this.maximumVerticalBound) {
                this.verticalBound += CAMERA.ORTHOGRAPHIC_ZOOM_INCREMENT;
            }
        }
        this.cameraPerspective.position.clampLength(CAMERA.CLOSEST_DISTANCE_FROM_CAR, CAMERA.FARTHEST_DISTANCE_FROM_CAR);
    }

    public getCameraPosition( perspectiveCameraIsActive: boolean ): Vector3 {
        if (perspectiveCameraIsActive) {
            return this.position.clone().add(this.cameraPerspective.position);
        } else {
            return this.position.clone().add(this.cameraOrthographic.position);
        }
    }

    public setCameraForPreview(): void {
        this.maximumVerticalBound = CAMERA.PREVIEW_VERTICAL_BOUND;
        this.verticalBound = CAMERA.PREVIEW_VERTICAL_BOUND;
    }

    private getHorizontalBound(aspectRatio: number): number {
        return aspectRatio * this.verticalBound;
    }

    public get perspectiveCamera(): PerspectiveCamera {
        return this.cameraPerspective;
    }
    public get orthographicCamera(): OrthographicCamera {
        return this.cameraOrthographic;
    }
    public get sceneVerticalBound(): number {
        return this.verticalBound;
    }
}
