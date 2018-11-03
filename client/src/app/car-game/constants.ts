import { Vector3, Euler } from "three";
/*tslint:disable:no-magic-numbers*/
export const STRAIGHT_ANGLE_DEG: number = 180;
export const MIN_TO_SEC: number = 60;
export const MS_TO_SECONDS: number = 1000;
export const DEFAULT_DELTATIME: number = 16.67 / MS_TO_SECONDS;
export const GRAVITY: number = -9.81;
export const EPSILON: number = 1e-5;
export const Y_AXIS: Vector3 = new Vector3(0, 1, 0);
export const TOWARDS_GROUND: Vector3 = new Vector3(0, -1, 0);

export const DEFAULT_WHEEL_RADIUS: number = 0.3505;
export const DEFAULT_WHEEL_MASS: number = 15;
export const DEFAULT_FRICTION_COEFFICIENT: number = 1;

export const PI_OVER_2: number = Math.PI / 2;
export const INERTIA_FACTOR: number = 1 / 12;
export const DEFAULT_WHEELBASE: number = 2.78;
export const DEFAULT_MASS: number = 1515;
export const DEFAULT_DRAG_COEFFICIENT: number = 0.35;
export const MAXIMUM_STEERING_ANGLE: number = 0.25;
export const INITIAL_MODEL_ROTATION: Euler = new Euler(0, PI_OVER_2, 0);
export const INITIAL_WEIGHT_DISTRIBUTION: number = 0.5;
export const MINIMUM_SPEED: number = 0.05;
export const NUMBER_REAR_WHEELS: number = 2;
export const NUMBER_WHEELS: number = 4;
export const DRIFT_COEFFICIENT: number = 0.8;
export const DRIFT_SIDE_COEFFICIENT: number = 6;
export const MIN_LATERAL_SPEED: number = 0.5;
export const CAR_WIDTH: number = 1.4;
export const CAR_LENGTH: number = 3.6;
export const HALF: number = 0.5;
export const NUMBER_OF_CAR_CORNERS: number = 4;
export const NUMBER_OF_VERTICES: number = 4;
export const MAX_REAR_SPEED: number = 10;
export const SHIFTING_VOLUME: number = 8;
export const DEFAULT_LINE_WIDTH: number = 20;
export const CIRCLE_RADIUS: number = DEFAULT_LINE_WIDTH / 2;
export const CIRCLE_SEGMENTS: number = 64;
export const IS_EDITOR: boolean = true;
export const IS_PREVIEW: boolean = true;

export const TOTAL_LAP_COUNT: number = 3;
export const SIDE_ROAD_RATIO: number = 3 / 10;
export const PARALLELISM_FACTOR: number = 0.998;
export const MAXIMUM_STUCK_COUNTER: number = 80;
export const ADDITIONNAL_RADIUS: number = 10;
export const ADDITIONNAL_RADIUS_FACTOR: number = 35;

export const ASSET_FOLDER: string = "/assets/";
export const STARTING_SOUND: string = "starting-sound";
export const CAR_SOUND_FOLDER: string = "car-sound/";
export const CAR_COLLISION_SOUND: string = "car-collision";
export const WALL_COLLISION_SOUND: string = "wall-collision";
export const IDLE_SOUND: string = "idle";
export const SHIFTING_SOUND: string = "shifting";
export const MP3_EXTENSION: string = ".mp3";
export const MAX_SOUND_RPM: number = 5500;
export const SOUND_REFERENCE_DISTANCE: number = 7;
export const PLAYBACK_RATE_OFFSET: number = 0.7;
export const WALL_COLLISION_SOUND_MAX_SPEED: number = 500;
export const CAR_COLLISION_SOUND_MAX_SPEED: number = 500;
export const TWENTY_FIVE_PERCENT: number = 25;
export const COUNTDOWN_SOUND_VOLUME: number = 0.5;

export const WHITE: number = 0xFFFFFF;
export const DISTANCE_FACTOR: number = 20;

export const PLANE_SIZE: number = 10000;
export const OFFROAD_POSITION_Y: number = -0.5;
export const IMAGE_SIZE: number = 1024;

export const enum LIGHTING { DAY, NIGHT }
export const DAY_INTENSITY: number = 0;
export const NIGHT_INTENSITY: number = 1;
export const DAY_OPACITY: number = 0.7;
export const NIGHT_OPACITY: number = 0.3;
export const HEADLIGHT_DISTANCE: number = 30;
export const HEADLIGHT_ANGLE: number = 0.5;
export const HEADLIGHT_DECAY: number = 0.1;
export const DAY_TRACK_TYPE: string = "jour";

export const POSITION_OFFSET: number = 2;
export const PLAYER_ONE: number = 1;
export const PLAYER_TWO: number = 2;
export const PLAYER_THREE: number = 3;
export const PLAYER_FOUR: number = 4;
export const LINE_OFFSET: number = 5;
export const STARTING_LINE_POSITION_Y: number = 0.1;

export const PLAYER_NAME: string = "1";
export const VERTICES_PER_PLANES: number = 4;
