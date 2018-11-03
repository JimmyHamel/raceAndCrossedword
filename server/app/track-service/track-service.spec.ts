/* tslint:disable*/
import * as request from "request-promise-native";
import * as assert from "assert";
import { BASE_SERVER_URL, TRACK_SERVICE_URL, TRACK_URL, TRACKS_URL } from "../../../common/communication/communication-url";
import { ServerResponse } from "../../../common/interface/server-response-interface";
import { TracksResponse, TrackResponse } from "../../../common/interface/track-response-interface";
const params = {
    method: "GET",
    body: {},
    uri : "",
    resolveWithFullResponse: true,
    json: true
};

const baseURL: string = BASE_SERVER_URL + TRACK_SERVICE_URL;
const trackURL: string = baseURL + TRACK_URL;
const tracksURL: string = baseURL + TRACKS_URL;
let id: string = "5ad6581ac1aef01d10d169dc";
describe("Track service", () => {

    it("should create a new track", (done: MochaDone) => {
        params.method = "POST",
        params.uri = trackURL;
        params.body = {
            name: "test",
            description: "This is a test track",
            _id: id,
        };
        request(params)
            .then(((response: ServerResponse) => {
                assert.equal(response.status, 200);
                done();
            }))
            .catch( (err: string) => {
                done();
            });
    });

    it("should get all tracks", (done: MochaDone) => {
        params.uri = tracksURL;
        params.method = "GET";
        request(params)
            .then(((response: TracksResponse) => {
                const length: number = response.tracks.length;
                assert.equal(length > 0, true);
                done();
            }))
            .catch( (err: string) => {
                done();
            });
    });

    it("should get one track", (done: MochaDone) => {
        params.uri = trackURL + id;
        params.method = "GET";
        request(params)
            .then(((response: TrackResponse) => {
                assert.equal(response.track, true);
                done();
            }))
            .catch( (err: string) => {
                done();
            });
    });

    it("should update one track", (done: MochaDone) => {
        params.uri = trackURL;
        params.method = "PATCH";
        params.body = {
            name: "modified",
            _id: id,
        };
        request(params)
            .then(((response: ServerResponse) => {
                assert.equal(response.status, 200);
                done();
            }))
            .catch( (err: string) => {
                done();
            });
    });

    it("should delete one track", (done: MochaDone) => {
        params.uri = trackURL + id;
        params.method = "DELETE";
        request(params)
            .then(((response: ServerResponse) => {
                assert.equal(response.status, 200);
                done();
            }))
            .catch( (err: string) => {
                done();
            });
    });
});
