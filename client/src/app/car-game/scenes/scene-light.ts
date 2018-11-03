import { AmbientLight, Object3D } from "three";
import { WHITE } from "../constants";
import { Visitor } from "../render-service/time-visitor/visitor";
import { Element } from "../render-service/time-visitor/element";

export class SceneLight extends Object3D implements Element {
    private ambientLight: AmbientLight;

    public constructor() {
        super();
        this.ambientLight = new AmbientLight(WHITE);
        this.add(this.ambientLight);
    }

    public set opacity(newOpacity: number) {
        this.ambientLight.intensity = newOpacity;
    }

    public accept(visitor: Visitor): void {
        visitor.visit(this);
    }
}
