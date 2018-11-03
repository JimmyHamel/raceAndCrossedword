import { Skybox } from "../skybox";
import { Offroad } from "../offroad";
import { Car } from "../../car/car";
import { SceneLight } from "../../scenes/scene-light";

export interface Visitor {
    visit(element: Skybox | Offroad| Car | SceneLight): void;
}
