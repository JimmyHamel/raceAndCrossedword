import { BoxGeometry, MultiMaterial, Mesh, TextureLoader, Object3D, DoubleSide, MeshPhongMaterial } from "three";
import { LIGHTING } from "../constants";
import { Element } from "./time-visitor/element";
import { Visitor } from "./time-visitor/visitor";

const SKYBOX_CUBE_SIZE: number = 10000;
const CUBE_NUMBER_OF_SIDES: number = 6;
const imagePrefix: string = "../../assets/";
const imageNames: string[] = ["morning_", "nightsky_"];
const imageSuffix: string[] = ["ft.png", "bk.png", "up.png", "dn.png", "rt.png", "lf.png"];

export class Skybox extends Object3D implements Element {
    private materials: MeshPhongMaterial[][];
    private skyboxGeometry: BoxGeometry;
    private material: MultiMaterial[];
    private _skybox: Mesh[];

    public constructor() {
        super();
        this.materials = [[], []];
        this._skybox = [];
        this.material = [];
        this.loadImages();
        this.skyboxGeometry = new BoxGeometry(SKYBOX_CUBE_SIZE, SKYBOX_CUBE_SIZE, SKYBOX_CUBE_SIZE);
        this.material.push(new MultiMaterial(this.materials[LIGHTING.DAY]));
        this.material.push(new MultiMaterial(this.materials[LIGHTING.NIGHT]));
        this._skybox[LIGHTING.DAY] = new Mesh(this.skyboxGeometry, this.material[LIGHTING.DAY]);
        this._skybox[LIGHTING.NIGHT] = new Mesh(this.skyboxGeometry, this.material[LIGHTING.NIGHT]);
        this.add(this._skybox[LIGHTING.DAY]);
        this.add(this._skybox[LIGHTING.NIGHT]);
    }

    private loadImages(): void {
        let imageFileName: string = "";
        for (let i: number = 0; i < CUBE_NUMBER_OF_SIDES * 2; i++) {
            imageFileName = imagePrefix + imageNames[Math.floor(i / CUBE_NUMBER_OF_SIDES)] + imageSuffix[i % CUBE_NUMBER_OF_SIDES];
            this.materials[Math.floor(i / CUBE_NUMBER_OF_SIDES)]
                .push(new MeshPhongMaterial({ map: new TextureLoader().load(imageFileName), side: DoubleSide }));
        }
    }

    public set daySkybox(isDayTime: boolean) {
        this._skybox[LIGHTING.DAY].visible = isDayTime;
    }

    public set nightSkybox(isNightTime: boolean) {
        this._skybox[LIGHTING.NIGHT].visible = isNightTime;
    }

    public accept(visitor: Visitor): void {
        visitor.visit(this);
    }
}
