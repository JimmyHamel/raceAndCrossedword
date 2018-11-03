import { TestBed, inject } from "@angular/core/testing";
import { DEFAULT_MASS } from "../constants";
import { CollisionService } from "./collision.service";
import { Car } from "../car/car";
import { Vector3 } from "three";

/* tslint:disable: no-magic-numbers */
describe("CollisionService", () => {
  let mockCar1: Car;
  let mockCar2: Car;

  beforeEach(async (done: () => void) => {
    TestBed.configureTestingModule({
      providers: [CollisionService]
    });
    mockCar1 = new Car();
    await mockCar1.init();
    mockCar2 = new Car();
    await mockCar2.init();
    done();
  });

  it("should be created", inject([CollisionService], (service: CollisionService) => {
    expect(service).toBeTruthy();
  }));

  it("should be an elastic collision", inject([CollisionService], (service: CollisionService) => {
    mockCar1.meshPosition = new Vector3(10, 0, 0);
    mockCar2.meshPosition = new Vector3(0, 0, 0);
    mockCar2.angle = Math.PI;
    const cars: Car[] = [];
    cars.push(mockCar1);
    cars.push(mockCar2);
    service.initialize(cars);
    const numberOfCars: number = 2;
    const totalMass: number = DEFAULT_MASS * numberOfCars;
    mockCar1.angle = Math.PI;
    while (!mockCar1.boundingRectangle.intersect(mockCar2.boundingRectangle)) {
      mockCar1.accelerate();
      mockCar2.accelerate();
      mockCar1.update(16.6);
      mockCar2.update(16.6);
    }
    const totalInitialEnergy: number = totalMass * (Math.pow(mockCar1.speed.length(), 2) + Math.pow(mockCar2.speed.length(), 2)) * 0.5;
    service.update();
    const finalEnergy: number = totalMass * (Math.pow(mockCar1.speed.length(), 2) + Math.pow(mockCar2.speed.length(), 2)) * 0.5;
    expect(finalEnergy).toBe(totalInitialEnergy);
  }));

  it("should change the speed of a car after a collision", inject([CollisionService], (service: CollisionService) => {
    mockCar1.meshPosition = new Vector3(10, 0, 0);
    mockCar2.meshPosition = new Vector3(0, 0, 0);
    mockCar2.angle = Math.PI;
    const cars: Car[] = [];
    cars.push(mockCar1);
    cars.push(mockCar2);
    service.initialize(cars);
    mockCar1.angle = Math.PI;
    while (!mockCar1.boundingRectangle.intersect(mockCar2.boundingRectangle)) {
      mockCar1.accelerate();
      mockCar2.accelerate();
      mockCar1.update(16.6);
      mockCar2.update(16.6);
    }
    const initialSpeed: Vector3 = mockCar2.speed.clone();
    service.update();
    const finalSpeed: Vector3 = mockCar2.speed.clone();
    expect(finalSpeed === initialSpeed).toBe(false);
  }));

});
