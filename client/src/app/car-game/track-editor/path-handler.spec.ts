import { PathHandler } from "./path-handler";
import { Scene } from "three";
import { CameraContainer } from "../camera-container/camera-container";

/* tslint:disable:no-magic-numbers*/
describe("PathHandler", () => {
    let pathHandler: PathHandler;

    beforeEach(() => {
        pathHandler = new PathHandler(new Scene(), new CameraContainer());
    });

    it("PathHandler should be created", () => {
        expect(pathHandler).toBeTruthy();
    });

});
