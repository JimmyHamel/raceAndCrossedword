import { Visitor } from "./visitor";
import { Skybox } from "../skybox";
import { Offroad } from "../offroad";
import { Car } from "../../car/car";
import { SceneLight } from "../../scenes/scene-light";
import { DAY_INTENSITY, DAY_OPACITY } from "../../constants";

export class DayVisitor implements Visitor {
    public visit(element: Skybox | Offroad| Car | SceneLight): void {
        if (element instanceof Skybox) {
            element.daySkybox = true;
            element.nightSkybox = false;
        } else if (element instanceof Offroad) {
            element.dayOffroad = true;
            element.nightOffroad = false;
        } else if (element instanceof Car) {
            element.headLightIntensity = DAY_INTENSITY;
        } else if (element instanceof SceneLight) {
            element.opacity = DAY_OPACITY;
        }
    }
}
