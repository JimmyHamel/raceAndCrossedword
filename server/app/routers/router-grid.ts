import { injectable, inject } from "inversify";
import { Router, Request, Response } from "express";
import Types from "../types";
import { ServiceGrid } from "../grid-service/grid-service";
import { GENERATE_URL, GET_GRID_URL } from "../../../common/communication/communication-url";
@injectable()
export class RouterGrid {

    public constructor(@inject(Types.ServiceGrid) private serviceGrid: ServiceGrid) { }

    public get routes(): Router {
        const router: Router = Router();

        router.get(
            "/" + GENERATE_URL,
            (req: Request, res: Response) => this.serviceGrid.generate(req.query.difficulty, res));

        router.get(
            "/" + GET_GRID_URL,
            (req: Request, res: Response) => this.serviceGrid.getGrid(req.query.difficulty, res));

        return router;
    }

}
