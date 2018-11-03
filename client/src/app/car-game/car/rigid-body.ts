import { Vector3, Quaternion } from "three";
import { Wheel } from "./wheel";
import { Engine } from "./engine";
import { MINIMUM_SPEED, Y_AXIS, DRIFT_COEFFICIENT, GRAVITY, NUMBER_REAR_WHEELS,
         NUMBER_WHEELS, DEFAULT_WHEELBASE, INITIAL_WEIGHT_DISTRIBUTION,
         INERTIA_FACTOR, CAR_WIDTH, CAR_LENGTH, MAX_REAR_SPEED, DRIFT_SIDE_COEFFICIENT, MIN_LATERAL_SPEED } from "../constants";

export class RigidBody {
    private readonly engine: Engine;
    public readonly mass: number;
    private readonly rearWheel: Wheel;
    private readonly wheelbase: number;
    private readonly dragCoefficient: number;

    private isBraking: boolean;
    private isAcceleratorPressed: boolean;
    private steeringWheelDirection: number;
    private _speed: Vector3;
    private _angularSpeed: number;
    private _angularRotation: number;
    private _position: Vector3;
    private _weightRear: number;
    private _currentRotation: Quaternion;
    private _collisionRotationSpeed: number;

    public get inertia(): number {
        return this.mass * (Math.pow(CAR_WIDTH, 2) + Math.pow(CAR_LENGTH, 2)) * INERTIA_FACTOR;
    }

    public get currentRotation(): Quaternion {
        return this._currentRotation.clone();
    }

    public get angularSpeed(): number {
        return this._angularSpeed + this._collisionRotationSpeed;
    }

    public set angularSpeed(collisionRotationSpeed: number) {
        this._collisionRotationSpeed = collisionRotationSpeed - this._angularSpeed;
    }

    public get speed(): Vector3 {
        return this._speed.clone();
    }

    public set speed(speed: Vector3) {
        this._speed = speed;
    }

    public get direction(): Vector3 {
        const carDirection: Vector3 = new Vector3(0, 0, -1);
        carDirection.applyQuaternion(this._currentRotation);

        return carDirection;
    }

    public get angularRotation(): number {
        return this._angularRotation;
    }

    public get position(): Vector3 {
        return this._position.clone();
    }

    public set position(newPosition: Vector3) {
        this._position = newPosition;
    }

    public setBraking(isBraking: boolean): void {
        this.isBraking = isBraking;
    }

    public setSteering(steering: number): void {
        this.steeringWheelDirection = steering;
    }

    public setAcceleration(isAcceleratorPressed: boolean): void {
        this.isAcceleratorPressed = isAcceleratorPressed;
    }

    public constructor(
        engine: Engine,
        rearWheel: Wheel,
        wheelbase: number,
        mass: number,
        dragCoefficient: number) {

        this.engine = engine;
        this.rearWheel = rearWheel;
        this.wheelbase = wheelbase;
        this.mass = mass;
        this.dragCoefficient = dragCoefficient;
        this.isBraking = false;
        this.steeringWheelDirection = 0;
        this._weightRear = INITIAL_WEIGHT_DISTRIBUTION;
        this._speed = new Vector3(0, 0, 0);
        this._angularRotation = 0;
        this._position = new Vector3(0, 0, 0);
        this._collisionRotationSpeed = 0;
        this._currentRotation = new Quaternion();
    }

    public update(deltaTime: number, currentRotation: Quaternion): void {
        this._currentRotation = currentRotation.clone();
        this._angularRotation = 0;
        this.physicsUpdate(deltaTime);
        this.updateAngularSpeed(deltaTime);
        this._angularRotation = (this._angularSpeed + this._collisionRotationSpeed) * deltaTime;

    }

    private physicsUpdate(deltaTime: number): void {
        this.engine.update(this._speed.length(), this.rearWheel.radius);
        this._weightRear = this.getWeightDistribution();
        this._speed.add(this.getLongitudinalDeltaSpeed(deltaTime));
        this._speed.add(this.getLateralDeltaSpeed(deltaTime));
        this._speed.setLength(this._speed.length() <= MINIMUM_SPEED ? 0 : this._speed.length());
        if (Math.sign(this._collisionRotationSpeed) !==
            Math.sign(this._collisionRotationSpeed + this.getRotationalFrictionSpeed(deltaTime))) {
            this._collisionRotationSpeed = 0;
        } else {
            this._collisionRotationSpeed += this.getRotationalFrictionSpeed(deltaTime);
        }
        this._position.add(this.getDeltaPosition(deltaTime));
    }

    private getWeightDistribution(): number {
        const acceleration: number = this.getLongitudinalAcceleration().length();
        /* tslint:disable:no-magic-numbers */
        const distribution: number = this.mass + (1 / this.wheelbase) * this.mass * acceleration / 2;

        return Math.min(Math.max(0.25, distribution), 0.75);
        /* tslint:enable:no-magic-numbers */
    }

    private getLongitudinalAcceleration(): Vector3 {
        return this.getLongitudinalForce().divideScalar(this.mass);
    }

    private getLongitudinalForce(): Vector3 {
        const resultingForce: Vector3 = new Vector3();

        if (this._speed.length() >= MINIMUM_SPEED) {
            const dragForce: Vector3 = this.getDragForce();
            const rollingResistance: Vector3 = this.getRollingResistance();
            if (this.isGoingForward()) {
                resultingForce.add(dragForce).add(rollingResistance);
            } else {
                resultingForce.sub(dragForce).sub(rollingResistance);
            }
        }
        if (this.isAcceleratorPressed) {
            resultingForce.add(this.getAccelerationForce());
            if (!this.isGoingForward()) {
                resultingForce.sub(this.getBrakeForce());
            }
        } else if (this.isBraking && this.isGoingForward()) {
            const brakeForce: Vector3 = this.getBrakeForce();
            resultingForce.add(brakeForce);
        } else if (this.isBraking && this.speed.length() < MAX_REAR_SPEED) {
            resultingForce.sub(this.getAccelerationForce());
        }

        return resultingForce;
    }

    private getAccelerationForce(): Vector3 {
        const tractionForce: number = this.getTractionForce();
        const accelerationForce: Vector3 = this.direction;
        accelerationForce.multiplyScalar(tractionForce);

        return accelerationForce;
    }

    private getDragForce(): Vector3 {
        const carSurface: number = 3;
        const airDensity: number = 1.2;
        const resistance: Vector3 = this.direction;
        resistance.multiplyScalar(airDensity * carSurface * -this.dragCoefficient * Math.pow(this.getForwardSpeed(), 2));

        return resistance;
    }

    private getRollingResistance(): Vector3 {
        const tirePressure: number = 1;
        // formula taken from: https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html
        // tslint:disable-next-line:no-magic-numbers
        const rollingCoefficient: number = (1 / tirePressure) * (Math.pow(this.getForwardSpeed() * 3.6 / 100, 2) * 0.0095 + 0.01) + 0.005;

        return this.direction.multiplyScalar(rollingCoefficient * this.mass * GRAVITY);
    }

    private getTractionForce(): number {
        const force: number = this.getEngineForce();
        const maxForce: number =
            this.rearWheel.frictionCoefficient * this.mass * GRAVITY * this._weightRear * NUMBER_REAR_WHEELS / NUMBER_WHEELS;

        return -Math.min(force, maxForce);
    }

    private getBrakeForce(): Vector3 {
        return this.direction.multiplyScalar(this.rearWheel.frictionCoefficient * this.mass * GRAVITY);
    }

    private getEngineForce(): number {
        return this.engine.getDriveTorque() / this.rearWheel.radius;
    }

    private getLongitudinalDeltaSpeed(deltaTime: number): Vector3 {
        return this.getLongitudinalAcceleration().multiplyScalar(deltaTime);
    }

    private getLateralDeltaSpeed(deltaTime: number): Vector3 {
        return this.getLateralAcceleration().multiplyScalar(deltaTime);
    }

    private getLateralAcceleration(): Vector3 {
        return this.getLateralForce().divideScalar(this.mass);
    }

    private getLateralForce(): Vector3 {
        if (this.getForwardSpeed() < this.speed.length()) {
            return this.getDriftResistance();
        }

        return new Vector3();
    }

    private getDriftResistance(): Vector3 {
        const lateralDirection: Vector3 = this.direction.cross(Y_AXIS);
        const lateralSpeed: Vector3 = this.speed.projectOnVector(lateralDirection);
        if (lateralSpeed.length() < MIN_LATERAL_SPEED) {
            this._speed.sub(lateralSpeed);

            return new Vector3();
        }

        return lateralSpeed.normalize().multiplyScalar(DRIFT_COEFFICIENT * GRAVITY * this.mass * DRIFT_SIDE_COEFFICIENT);
    }

    private getDeltaPosition(deltaTime: number): Vector3 {
        return this.speed.multiplyScalar(deltaTime);
    }

    private isGoingForward(): boolean {
        // tslint:disable-next-line:no-magic-numbers
        return this.speed.normalize().dot(this.direction) > 0.05;
    }

    private getForwardSpeed(): number {
        return this.speed.dot(this.direction);
    }

    private updateAngularSpeed(deltaTime: number): void {
        const R: number = DEFAULT_WHEELBASE / Math.sin(this.steeringWheelDirection * deltaTime);
        this._angularSpeed = this._speed.length() / (R * deltaTime);
    }

    private getRotationalFrictionSpeed(deltaTime: number): number {
        if (this._collisionRotationSpeed > 0) {
            return CAR_LENGTH * DRIFT_COEFFICIENT * GRAVITY * this.mass  * deltaTime / (this.inertia * 2);
        } else if (this._collisionRotationSpeed < 0) {
            return - CAR_LENGTH * DRIFT_COEFFICIENT * GRAVITY * this.mass  * deltaTime / (this.inertia * 2);
        }

        return 0;
    }
}
