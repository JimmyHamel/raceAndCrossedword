import { Mesh, Object3D, RepeatWrapping, Texture, PlaneGeometry, TextureLoader, MeshPhongMaterial, Vector2 } from "three";
import { PI_OVER_2, LIGHTING, PLANE_SIZE, OFFROAD_POSITION_Y, IMAGE_SIZE } from "../constants";
import { Element } from "./time-visitor/element";
import { Visitor } from "./time-visitor/visitor";

const DAY_IMAGE_NAME: string = "../../assets/Grass_1024.png";
const NIGHT_IMAGE_NAME: string = "../../assets/DarkGrass_1024.png";

export class Offroad extends Object3D implements Element {
    private texture: Texture[];
    private material: MeshPhongMaterial[];
    private geometry: PlaneGeometry;
    private offroad: Mesh[];

    public constructor() {
        super();
        this.texture = [];
        this.material = [];
        this.offroad = [];
        this.initializeTextures();
        this.initializeMaterials();
        this.initializeGeometry();
        this.initializeOffroads();
    }

    private initializeTextures(): void {
        this.texture.push(new TextureLoader().load(DAY_IMAGE_NAME));
        this.texture[LIGHTING.DAY].wrapS = RepeatWrapping;
        this.texture[LIGHTING.DAY].wrapT = RepeatWrapping;
        this.texture[LIGHTING.DAY].repeat = new Vector2(IMAGE_SIZE, IMAGE_SIZE);
        this.texture.push(new TextureLoader().load(NIGHT_IMAGE_NAME));
        this.texture[LIGHTING.NIGHT].wrapS = RepeatWrapping;
        this.texture[LIGHTING.NIGHT].wrapT = RepeatWrapping;
        this.texture[LIGHTING.NIGHT].repeat = new Vector2(IMAGE_SIZE, IMAGE_SIZE);
    }

    private initializeMaterials(): void {
        this.material.push(new MeshPhongMaterial({map: this.texture[LIGHTING.DAY]}));
        this.material.push(new MeshPhongMaterial({map: this.texture[LIGHTING.NIGHT]}));
    }

    private initializeGeometry(): void {
        this.geometry = new PlaneGeometry( PLANE_SIZE, PLANE_SIZE, 1, 1);

    }

    private initializeOffroads(): void {
        this.offroad.push(new Mesh(this.geometry, this.material[LIGHTING.DAY]));
        this.offroad[LIGHTING.DAY].position.y = OFFROAD_POSITION_Y;
        this.offroad[LIGHTING.DAY].rotation.set(-PI_OVER_2, 0, 0);
        this.add(this.offroad[LIGHTING.DAY]);
        this.offroad.push(new Mesh(this.geometry, this.material[LIGHTING.NIGHT]));
        this.offroad[LIGHTING.NIGHT].position.y = OFFROAD_POSITION_Y;
        this.offroad[LIGHTING.NIGHT].rotation.set(-PI_OVER_2, 0, 0);
        this.add(this.offroad[LIGHTING.NIGHT]);
    }

    public set dayOffroad(dayIsVisible: boolean) {
        this.offroad[LIGHTING.DAY].visible = dayIsVisible;
    }

    public set nightOffroad(nightIsVisible: boolean) {
        this.offroad[LIGHTING.NIGHT].visible = nightIsVisible;
    }

    public accept(visitor: Visitor): void {
        visitor.visit(this);
    }

}
