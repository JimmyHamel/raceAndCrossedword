import { Track } from "../../../../../../common/interface/track";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

@Injectable()
export class PreviewService {

    public track: Subject<Track>;

    public constructor() {
        this.track = new Subject();
    }

    public getTrack(): Observable<Track> {
        return this.track.asObservable();
    }
    public notifyTrack(trackInput: Track): void {
        this.track.next(trackInput);
    }

}
