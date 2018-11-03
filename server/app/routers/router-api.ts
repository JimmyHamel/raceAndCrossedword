import { injectable, inject } from "inversify";
import { Router } from "express";
import Types from "../types";
import { RouterLexical } from "./router-lexical";
import { RouterGrid } from "./router-grid";
import { RouterTrack } from "./router-track";

const PATH_LEXICALSERVICE: string = "/lexicalservice";
const PATH_SERVICEGRID: string = "/servicegrid";
const PATH_TRACKSERVICE: string = "/trackservice";
@injectable()
export class RouterApi {

    public constructor(
        @inject(Types.RouterLexical) private routerLexical: RouterLexical,
        @inject(Types.RouterGrid) private routerGrid: RouterGrid,
        @inject(Types.RouterTrack) private routerTrack: RouterTrack) { }

    public get routes(): Router {
        const router: Router = Router();
        router.use(PATH_LEXICALSERVICE, this.routerLexical.routes);
        router.use(PATH_SERVICEGRID, this.routerGrid.routes);
        router.use(PATH_TRACKSERVICE, this.routerTrack.routes);

        return router;
    }
}
