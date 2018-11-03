import { TrackCountdownService } from "./track-countdown.service";

const trackCountdownService: TrackCountdownService = new TrackCountdownService();

describe("TrackListComponent", () => {
    it("Should decrement value", () => {
        trackCountdownService.countdownObservable.subscribe((value) => {
            expect(value).toEqual(2);
        });
    });
});
