import { Vector3, Matrix4, Object3D, ObjectLoader, Quaternion, SpotLight } from "three";
import { Engine } from "./engine";
import {
    MS_TO_SECONDS,
    DEFAULT_WHEELBASE,
    DEFAULT_MASS,
    DEFAULT_DRAG_COEFFICIENT,
    MAXIMUM_STEERING_ANGLE,
    INITIAL_MODEL_ROTATION,
    DISTANCE_FACTOR, WHITE,
    HEADLIGHT_DISTANCE,
    HEADLIGHT_ANGLE,
    HEADLIGHT_DECAY
} from "../constants";
import { Wheel } from "./wheel";
import { OrientedBoundingRectangle } from "../collision/oriented-bounding-rectangle";
import { RigidBody } from "./rigid-body";
import { Sound } from "../sound-service/sound";
import { CarCollisionSound } from "../sound-service/car-collision-sound";
import { WallCollisionSound } from "../sound-service/wall-collision-sound";
import { Visitor } from "../render-service/time-visitor/visitor";
import { Element } from "../render-service/time-visitor/element";

const enum Headlights { left, right }
const Y_POSITION: number = 0.5;
const enum SoundType { wall, car }

export class Car extends Object3D implements Element {
    private readonly engine: Engine;

    private mesh: Object3D;
    public boundingRectangle: OrientedBoundingRectangle;
    private rigidBody: RigidBody;
    private _sound: Sound[];
    private headLights: SpotLight[];
    private targets: Object3D[];

    public constructor(
        engine: Engine = new Engine(),
        rearWheel: Wheel = new Wheel(),
        wheelbase: number = DEFAULT_WHEELBASE,
        mass: number = DEFAULT_MASS,
        dragCoefficient: number = DEFAULT_DRAG_COEFFICIENT) {
        super();
        this.headLights = [];
        this.targets = [];

        if (wheelbase <= 0) {
            console.error("Wheelbase should be greater than 0.");
            wheelbase = DEFAULT_WHEELBASE;
        }

        if (mass <= 0) {
            console.error("Mass should be greater than 0.");
            mass = DEFAULT_MASS;
        }

        if (dragCoefficient <= 0) {
            console.error("Drag coefficient should be greater than 0.");
            dragCoefficient = DEFAULT_DRAG_COEFFICIENT;
        }

        this.engine = engine;
        this.rigidBody = new RigidBody(engine, rearWheel, wheelbase, mass, dragCoefficient);
        this._sound = [new WallCollisionSound(), new CarCollisionSound()];
    }

    private async load(): Promise<Object3D> {
        return new Promise<Object3D>((resolve, reject) => {
            const loader: ObjectLoader = new ObjectLoader();
            loader.load("../../assets/camero/camero-2010-low-poly.json", (object) => {
                resolve(object);
            });
        });
    }

    public async init(): Promise<void> {
        this.mesh = await this.load();
        this.mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
        this.mesh.add(this.rpmSound.audio);
        this.mesh.add(this.shiftingSound.audio);
        this.mesh.add(this._sound[SoundType.wall].audio);
        this.mesh.add(this._sound[SoundType.car].audio);
        this.add(this.mesh);
        this.boundingRectangle = new OrientedBoundingRectangle(this);
        this.initializeHeadlights();
        this.initializeTargets();
    }

    public update(deltaTime: number): void {
        deltaTime = deltaTime / MS_TO_SECONDS;

        this.rigidBody.update(deltaTime, this.meshQuaternion);
        this.mesh.position.set(this.rigidBody.position.x, this.rigidBody.position.y, this.rigidBody.position.z);
        this.mesh.rotateY(this.rigidBody.angularRotation);

        this.boundingRectangle.update(this);
        this.setTargetPosition(Headlights.left);
        this.setTargetPosition(Headlights.right);
        this.updateHeadlights();
    }

    private initializeHeadlights(): void {
        this.headLights.push(new SpotLight(WHITE, 0, HEADLIGHT_DISTANCE, HEADLIGHT_ANGLE, 0, HEADLIGHT_DECAY));
        this.headLights.push(new SpotLight(WHITE, 0, HEADLIGHT_DISTANCE, HEADLIGHT_ANGLE, 0, HEADLIGHT_DECAY));
        this.add(this.headLights[Headlights.left]);
        this.add(this.headLights[Headlights.right]);
    }

    private updateHeadlights(): void {
        this.updateOneHeadLight(Headlights.left);
        this.updateOneHeadLight(Headlights.right);
    }
    private updateOneHeadLight(side: Headlights): void {
        const corner: Vector3 = side === Headlights.left ?
                                this.boundingRectangle.getFrontLeftCorner() : this.boundingRectangle.getFrontRightCorner();
        this.headLights[side].position.set(corner.x, Y_POSITION, corner.z);
        this.headLights[side].target.position.set(this.targets[side].position.x,
                                                  this.targets[side].position.y,
                                                  this.targets[side].position.z);
        this.headLights[side].target.updateMatrixWorld(true);
    }

    private initializeTargets(): void {
        this.targets.push(new Object3D());
        this.targets.push(new Object3D());
        this.setTargetPosition(Headlights.left);
        this.setTargetPosition(Headlights.right);
        this.add(this.targets[Headlights.left]);
        this.add(this.targets[Headlights.right]);
    }

    private setTargetPosition(target: number): void {
        const spotLightPosition: Vector3 = target ?
                                           this.boundingRectangle.getFrontRightCorner() : this.boundingRectangle.getFrontLeftCorner();
        const targetPosition: Vector3 = spotLightPosition.add(this.direction.clone().setLength(DISTANCE_FACTOR));
        this.targets[target].position.set(targetPosition.x, Y_POSITION, targetPosition.z);
    }

    public set headLightIntensity(newIntensity: number) {
        for (const headlight of this.headLights) {
            headlight.intensity = newIntensity;
            headlight.updateMatrixWorld(true);
        }
    }

    public setSpeed(speed: Vector3): void {
        this.rigidBody.speed = speed;
    }

    public get rpmSound(): Sound {
        return this.engine.rpmSound;
    }

    public get shiftingSound(): Sound {
        return this.engine.shiftingSound;
    }

    public steerLeft(): void {
        this.rigidBody.setSteering(MAXIMUM_STEERING_ANGLE);
    }

    public steerRight(): void {
        this.rigidBody.setSteering(-MAXIMUM_STEERING_ANGLE);
    }

    public releaseSteering(): void {
        this.rigidBody.setSteering(0);
    }

    public releaseBrakes(): void {
        this.rigidBody.setBraking(false);
    }

    public brake(): void {
        this.rigidBody.setBraking(true);
    }

    public accelerate(): void {
        this.rigidBody.setAcceleration(true);
    }

    public releaseAcceleration(): void {
        this.rigidBody.setAcceleration(false);
    }
    public stopSounds(): void {
        if (this.rpmSound) {
            this.rpmSound.stop();
        }
    }

    public get body(): RigidBody {
        return this.rigidBody;
    }
    public get speed(): Vector3 {
        return this.rigidBody.speed;
    }

    public get currentGear(): number {
        return this.engine.currentGear;
    }

    public get rpm(): number {
        return this.engine.rpm;
    }

    public get meshQuaternion(): Quaternion {
        return this.mesh.quaternion.clone();
    }
    public get angle(): number {
        return this.mesh.rotation.y;
    }

    public set angle(theta: number) {
        this.mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
        this.mesh.rotateY(theta);
        this.mesh.updateMatrixWorld(true);
    }

    public get meshPosition(): Vector3 {
        return this.rigidBody.position;
    }

    public set meshPosition(newPosition: Vector3) {
        this.rigidBody.position = newPosition;
    }

    public get direction(): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const carDirection: Vector3 = new Vector3(0, 0, -1);

        rotationMatrix.extractRotation(this.mesh.matrix);
        carDirection.applyMatrix4(rotationMatrix);

        return carDirection;
    }

    public accept(visitor: Visitor): void {
        visitor.visit(this);
    }

    public get carCollisionSound(): CarCollisionSound {
        return this._sound[SoundType.car] as CarCollisionSound;
    }

    public get wallCollisionSound(): WallCollisionSound {
        return this._sound[SoundType.wall] as WallCollisionSound;
    }
}
