import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { Vector3 } from "three";
import { RigidBody } from "../car/rigid-body";

const ELASTICITY: number = 1;

@Injectable()
export class CollisionService {
  private cars: Car[];
  public constructor() {
    this.cars = [];
  }

  public initialize(sceneCars: Car[]): void {
    for (const car of sceneCars) {
      this.cars.push(car);
    }
  }

  private handleRigidBodyCollision(bodyA: RigidBody, bodyB: RigidBody, contactPoint: Vector3, normal: Vector3): void {
    const angularSpeedA: Vector3 = new Vector3(0, bodyA.angularSpeed, 0);
    const distAToContact: Vector3 = contactPoint.clone().sub(bodyA.position);
    const angularSpeedB: Vector3 = new Vector3(0, bodyB.angularSpeed, 0);
    const distBToContact: Vector3 = contactPoint.clone().sub(bodyB.position);
    const initialABSpeed: Vector3 = bodyA.speed.clone().add(angularSpeedA.clone().cross(distAToContact))
                                    .sub(bodyB.speed).sub(angularSpeedB.clone().cross(distBToContact));

    const distACrossN: Vector3 = distAToContact.clone().cross(normal);
    const distBCrossN: Vector3 = distBToContact.clone().cross(normal);

    const impulse: number = -( (ELASTICITY + 1) * initialABSpeed.dot(normal)) /
                            ((1 / bodyA.mass) + (1 / bodyB.mass) +  (distACrossN.dot(distACrossN) / bodyA.inertia)
                             + (distBCrossN.dot(distBCrossN) / bodyB.inertia));

    bodyA.speed = bodyA.speed.add(normal.clone().multiplyScalar(impulse / bodyA.mass));
    bodyB.speed = bodyB.speed.sub(normal.clone().multiplyScalar(impulse / bodyB.mass));
    bodyA.angularSpeed = (angularSpeedA.clone().add(distAToContact.clone().cross(normal.clone()
                          .multiplyScalar(impulse)).multiplyScalar(1 / bodyA.inertia))).y;
    bodyB.angularSpeed = (angularSpeedB.clone().sub(distBToContact.clone().cross(normal.clone()
                          .multiplyScalar(impulse)).multiplyScalar(1 / bodyB.inertia))).y;
  }

  public update(): void {
    this.detectCollisions();
  }

  private detectCollisions(): void {
    for (let i: number = 0; i < this.cars.length; i++) {
      for (let j: number = i + 1; j < this.cars.length; j++) {
        const minTranslation: Vector3 = this.cars[i].boundingRectangle.intersect(this.cars[j].boundingRectangle);
        if (minTranslation) {
          this.cars[i].body.position = this.cars[i].body.position.add(minTranslation);
          this.cars[i].boundingRectangle.update(this.cars[i]);
          const contact: Vector3 = this.getContactPoint(this.cars[i], this.cars[j]);
          const contactNormal: Vector3 = this.calculateCollisionNormal(this.cars[i].boundingRectangle.calculatedNormals,
                                                                       this.cars[i], this.cars[j]);
          if (contact) {
              this.adjustCollisionVolume(this.cars[i]);
              this.playCollisionSound(this.cars[i]);
              this.handleRigidBodyCollision(
                this.cars[i].body,
                this.cars[j].body,
                contact,
                contactNormal.normalize());
            } else {
              this.stopCollisionSound(this.cars[i]);
          }
        }
      }
    }
  }

  private getContactPoint(carA: Car, carB: Car): Vector3 {
    return carA.boundingRectangle.findIntersectionPoints(carB.boundingRectangle);
  }

  private calculateCollisionNormal(normals: Vector3[], carA: Car, carB: Car): Vector3 {
    const speedDot: number = carA.speed.dot(carB.speed);
    let collisionNormal: Vector3 = new Vector3();
    if (speedDot < 0) {
      let minDot: number = Infinity;
      const speed: Vector3 = carA.speed;
      for (const normal of normals) {
        if (minDot > normal.dot(speed)) {
          minDot = normal.dot(speed);
          collisionNormal = normal;
        }
      }
    } else {
      let maxDot: number = 0;
      const speed: Vector3 = carB.speed;
      for (const normal of normals) {
        if (maxDot < normal.dot(speed)) {
          maxDot = normal.dot(speed);
          collisionNormal = normal;
        }
      }
    }

    return collisionNormal.normalize();
  }

  private adjustCollisionVolume(firstCar: Car): void {
    firstCar.carCollisionSound.ajustVolume(firstCar.speed.length());
  }

  private playCollisionSound(firstCar: Car): void {
    firstCar.carCollisionSound.play();
  }

  private stopCollisionSound(firstCar: Car): void {
    firstCar.carCollisionSound.stop();
  }
}
