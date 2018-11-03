import { TestBed, inject } from "@angular/core/testing";

import { TrackService } from "./track.service";
import { MockTrackService } from "./mock-track.service";
const goodStatus: number = 200;
const NB_OF_TRACKS: number = 2;
describe("TrackService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [{provide: TrackService, useClass: MockTrackService} ],
        });
    });

    it("should be created", inject([TrackService], (service: MockTrackService) => {
            expect(service).toBeTruthy();
    }));

    it("should get all tracks", inject([TrackService], (service: MockTrackService) => {
        expect(service.getTracks().tracks.length).toBe(NB_OF_TRACKS);
    }));

    it("should get one track", inject([TrackService], (service: MockTrackService) => {
        expect(service.getTrack("testid").track.name).toBe("piste1");
    }));

    it("should save one track", inject([TrackService], (service: MockTrackService) => {
        expect(service.saveTrack({}).status).toBe(goodStatus);
    }));

    it("should delete one track", inject([TrackService], (service: MockTrackService) => {
        expect(service.deleteTrack("testid").status).toBe(goodStatus);
    }));

    it("should update timesplayed", inject([TrackService], (service: MockTrackService) => {
        expect(service.incrementTimesPlayed({}).status).toBe(goodStatus);
    }));
});
