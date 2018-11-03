import "reflect-metadata";
import { injectable, } from "inversify";
import { Response, Request } from "express";
import { MODEL_NAME, TRACK_SCHEMA } from "./track.model";
import { Mongoose, Document, Model } from "mongoose";
import { STATUS } from "../constant/status-code";
import { TrackResponse, TracksResponse } from "../../../common/interface/track-response-interface";
import { ServerResponse } from "../../../common/interface/server-response-interface";
import { URL_BD_TRACK } from "../../../common/communication/communication-url";
module Route {
    @injectable()
    export class TrackService {
        private mongoose: Mongoose;
        private track: Model<Document>;

        public constructor() {
            this.mongoose = new Mongoose();
            this.mongoose.connect(URL_BD_TRACK).catch((err: string) => err);
            this.track = this.mongoose.connection.model(MODEL_NAME, TRACK_SCHEMA);
        }

        public getTracks(res: Response): void {
            this.mongoose.model(MODEL_NAME, TRACK_SCHEMA).find((err: string, result: Document[]) => {
                this.handleInternalError(res, err);
                this.sendResponse(res, { status: STATUS.successfulRequest, tracks: result});
            });
        }

        public getTrack(id: string, res: Response): void {
            this.mongoose.model(MODEL_NAME, TRACK_SCHEMA).findOne({_id: id}, (err: string, result: Document) => {
                this.handleInternalError(res, err);
                if (result) {
                    this.sendResponse(res, { status: STATUS.successfulRequest, track: result});
                } else {
                    this.sendResponse(res, { status: STATUS.badRequest, message: "No track found"});
                }
            });
        }

        public saveTrack(req: Request, res: Response): void {
            const newTrack: Document = this.createTrackFromBody(req);
            newTrack.isNew = true;
            newTrack.save().then(() => this.sendResponse(res,
                                                         { status: STATUS.successfulRequest,
                                                           message: "Track was successfully created with id=" + newTrack.id}))
                            .catch((err: string) => this.handleInternalError(res, err));
        }

        public updateTrack(req: Request, res: Response): void {
            const newTrack: Document = this.createTrackFromBody(req);
            newTrack.isNew = false;
            this.mongoose.model(MODEL_NAME, TRACK_SCHEMA).findByIdAndUpdate(newTrack._id, newTrack, (err: string, foundTrack: Document) => {
                this.handleInternalError(res, err);
                if (foundTrack) {
                    this.sendResponse(res, { status: STATUS.successfulRequest, message: "Track was successfully updated"});
                } else {
                    this.sendResponse(res, { status: STATUS.badRequest, message: "No track found to update"});

                }
            });
        }

        public deleteTrack(id: string, res: Response): void {
            const trackExistsPromise: Promise<boolean> = this.trackExists(id, res);
            trackExistsPromise.then((doesExists: Boolean) => {
                if (doesExists) {
                    this.mongoose.model(MODEL_NAME, TRACK_SCHEMA).deleteOne({_id: id}, (err: string) => {
                        this.handleInternalError(res, err);
                        this.sendResponse(res, { status: STATUS.successfulRequest, message: "Track was successfully deleted"});
                        });
                } else {
                    this.sendResponse(res, { status: STATUS.badRequest, message: "No track found to delete"});
                }
            }).catch((err: string) => err);
        }

        private async trackExists(id: string, res: Response): Promise<boolean> {
            return new Promise((resolve: (value?: boolean) => void, reject: (reason?: string) => void) => {
                this.mongoose.model(MODEL_NAME, TRACK_SCHEMA).findById({_id: id}, (err: string, result: Document) => {
                    this.handleInternalError(res, err);
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            });
        }

        private createTrackFromBody(req: Request): Document {
            return new this.track({
                name: req.body.name,
                description: req.body.description,
                points: req.body.points,
                highscores : req.body.highscores,
                playedCount: req.body.playedCount,
                type: req.body.type,
                _id : req.body._id
                });
        }

        private handleInternalError(res: Response, err: string): void {
            if (err) {
                this.sendResponse(res, {status: STATUS.badRequest, message: err});
            }
        }

        private sendResponse(res: Response, content: TrackResponse | TracksResponse | ServerResponse): void {
            if (!this.hasInternalError(res)) {
                res.json(content);
            }
        }

        private hasInternalError(res: Response): boolean {
            return res.headersSent;
        }

    }
}
export = Route;
