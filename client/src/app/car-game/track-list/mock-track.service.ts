import { Track } from "../../../../../common/interface/track";
import { TrackResponse, TracksResponse } from "../../../../../common/interface/track-response-interface";
import { ServerResponse } from "../../../../../common/interface/server-response-interface";

const TRACK1: Track = {
    name: "piste1",
    description: "newDescription",
    points: [],
    highscores: [],
    type: "Jour",
    playedCount: 0,
    _id: ""
};
const TRACK2: Track = {
    name: "piste2",
    description: "newDescription",
    points: [],
    highscores: [],
    type: "Jour",
    playedCount: 0,
    _id: ""
};
export class MockTrackService {
    public getTracks(): TracksResponse {
        return {
            status: 200,
            tracks: [TRACK1, TRACK2],
        };
    }

    public getTrack(id: string): TrackResponse {
        return {
            status: 200,
            track: TRACK1,
        };
    }

    public saveTrack(track: Track): ServerResponse {
        return {
            status: 200,
            message: "test",
        };
    }

    public deleteTrack(id: string): ServerResponse {
        return {
            status: 200,
            message: "test",
        };
    }

    public incrementTimesPlayed(track: Track): ServerResponse {
        return {
            status: 200,
            message: "test"
        };
    }
}
