import { Visitor } from "./visitor";
import { Skybox } from "../skybox";
import { Offroad } from "../offroad";
import { Car } from "../../car/car";
import { NIGHT_INTENSITY, NIGHT_OPACITY } from "../../constants";
import { SceneLight } from "../../scenes/scene-light";

export class NightVisitor implements Visitor {
    // On utilise une fonction avec plusieurs types possibles, car le compilateur typescript
    // traduit le code en javascript. Si on fait 4 fonctions visit avec la meme signature,
    // mais des types de parametres differents, typescript les traduira tous comme des fonctions javascripts
    // avec la meme signature.
    public visit(element: Skybox | Offroad| Car | SceneLight): void {
        if (element instanceof Skybox) {
            element.daySkybox = false;
            element.nightSkybox = true;
        } else if (element instanceof Offroad) {
            element.dayOffroad = false;
            element.nightOffroad = true;
        } else if (element instanceof Car) {
            element.headLightIntensity = NIGHT_INTENSITY;
        } else if (element instanceof SceneLight) {
            element.opacity = NIGHT_OPACITY;
        }
    }
}
