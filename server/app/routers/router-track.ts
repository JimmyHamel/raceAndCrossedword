import { injectable, inject } from "inversify";
import { Router, Request, Response } from "express";
import Types from "../types";
import { TrackService } from "../track-service/track-service";
@injectable()
export class RouterTrack {

    public constructor(@inject(Types.TrackService) private trackService: TrackService) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get(
                "/tracks",
                (req: Request, res: Response ) => this.trackService.getTracks(res));

        router.get(
                "/track/:id",
                (req: Request, res: Response ) => this.trackService.getTrack(req.params.id, res));

        router.post(
                "/track",
                (req: Request, res: Response ) => this.trackService.saveTrack(req, res));

        router.patch(
                "/track",
                (req: Request, res: Response ) => this.trackService.updateTrack(req, res));

        router.delete(
                "/track/:id",
                (req: Request, res: Response ) => this.trackService.deleteTrack(req.params.id, res));

        return router;
    }
}
