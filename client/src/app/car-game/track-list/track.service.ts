import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BASE_SERVER_URL, TRACK_SERVICE_URL, TRACKS_URL, TRACK_URL } from "../../../../../common/communication/communication-url";
import { TrackResponse, TracksResponse } from "../../../../../common/interface/track-response-interface";
import { Observable } from "rxjs/Observable";
import { ServerResponse } from "../../../../../common/interface/server-response-interface";
import { Track } from "../../../../../common/interface/track";

const TRACKS: string = BASE_SERVER_URL + TRACK_SERVICE_URL + TRACKS_URL;
const TRACK: string = BASE_SERVER_URL + TRACK_SERVICE_URL + TRACK_URL;

@Injectable()
export class TrackService {

    public tracks: Track[];
    public currentTrack: Track;

    public constructor(private http: HttpClient) {
        this.tracks = [];
    }

    public getTracks(): Observable<TracksResponse> {
        const tracksResponse: Observable<TracksResponse> = this.http.get<TracksResponse>(TRACKS);
        tracksResponse.subscribe((serverResponse: TracksResponse) => {
            this.tracks = serverResponse.tracks;
        });

        return tracksResponse;
    }

    public getTrack(id: string): Observable<TrackResponse> {
        const trackResponse: Observable<TrackResponse> = this.http.get<TrackResponse>(TRACK + id);
        trackResponse.subscribe((serverResponse: TrackResponse) => {
            this.currentTrack = serverResponse.track;
        });

        return trackResponse;
    }

    public saveTrack(track: Track): Observable<ServerResponse> {
        return this.http.post<ServerResponse>(
            TRACK, {
                name: track.name,
                description: track.description,
                points: track.points,
                type: track.type,
            }
        );
    }

    public updateTrack(track: Track): Observable<ServerResponse> {
        return this.http.patch<ServerResponse>(
            TRACK, {
                _id: track._id,
                name: track.name,
                description: track.description,
                points: track.points,
                type: track.type,
                playedCount: track.playedCount,
                highscores: track.highscores
            }
        );
    }

    public incrementTimesPlayed(track: Track): Observable<ServerResponse> {
        return this.http.patch<ServerResponse>(
            TRACK, {
                _id: track._id,
                name: track.name,
                description: track.description,
                points: track.points,
                type: track.type,
                playedCount: track.playedCount + 1,
                highscores: track.highscores
            }
        );
    }
    public deleteTrack(id: string): Observable<ServerResponse> {
        return this.http.delete<ServerResponse>(TRACK + id);
    }
}
