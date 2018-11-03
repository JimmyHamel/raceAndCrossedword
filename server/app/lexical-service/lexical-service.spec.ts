/* tslint:disable: no-magic-numbers no-inferrable-types await-promise no typedef */

import * as request from "request-promise-native";
import * as assert from "assert";
import { SERVICE_LEXICAL_URL, BASE_SERVER_URL } from "../../../common/communication/communication-url";
import { ApiResponseWord, ApiResponseWords, ApiResponseDefinition } from "../../../common/interface/api-response-interface";
import { STATUS } from "../constant/status-code";
const params = {
    uri : "",
    json: true
};

const baseURL: string = BASE_SERVER_URL + SERVICE_LEXICAL_URL;
const wordURL: string = baseURL + "/word/";
const wordsURL: string = baseURL + "/words/";
const definitionURL: string = baseURL + "/definition/";

describe("Lexical Service", () => {
    describe("Word", () => {
        it("Should return a 2 letter word (**, common)",  async () => {
            params.uri = wordURL + "**?rarety=common";
            const apiResponse: ApiResponseWord = await request(params).promise();
            assert.equal(apiResponse.word.length, 2);
        });

        it("Should return a 2 letter word (**, uncommon)",  async () => {
            params.uri = wordURL + "**?rarety=uncommon";
            const apiResponse: ApiResponseWord = await request(params).promise();
            assert.equal(apiResponse.word.length, 2);
        });

        it("Should return a 2 letter word (t*, common)",  async () => {
            params.uri = wordURL + "t*?rarety=common";
            const apiResponse: ApiResponseWord = await request(params).promise();
            assert.equal(apiResponse.word.length, 2);
        });

        it("Should return a 2 letter word (t*, uncommon)",  async () => {
            params.uri = wordURL + "t*?rarety=uncommon";
            const apiResponse: ApiResponseWord = await request(params).promise();
            assert.equal(apiResponse.word.length, 2);
        });

        it("Should return a 2 letter word (*t, common)",  async () => {
            params.uri = wordURL + "*t?rarety=common";
            const apiResponse: ApiResponseWord = await request(params).promise();
            assert.equal(apiResponse.word.length, 2);
        });

        it("Should return a 2 letter word (*t, uncommon)",  async () => {
            params.uri = wordURL + "*t?rarety=uncommon";
            const apiResponse: ApiResponseWord = await request(params).promise();
            assert.equal(apiResponse.word.length, 2);
        });

        it("Should return a 2 letter word (on, common)", async () => {
            params.uri = wordURL + "on?rarety=common";
            const apiResponse: ApiResponseWord = await request(params).promise();
            assert.equal(apiResponse.word, "on");
        });

        it("Should return a 2 letter word (sc, uncommon)", async () => {
            params.uri = wordURL + "sc?rarety=uncommon";
            const apiResponse: ApiResponseWord = await request(params).promise();
            assert.equal(apiResponse.word, "sc");
        });

        it("Should not return any word (a, common)", async () => {
            params.uri = wordURL + "a?rarety=common";
            const apiResponse: ApiResponseWord = await request(params).promise();
            assert.equal(apiResponse.status, STATUS.badRequest);
        });

        it("Should not return any word (a, uncommon)", async () => {
            params.uri = wordURL + "a?rarety=uncommon";
            const apiResponse: ApiResponseWord = await request(params).promise();
            assert.equal(apiResponse.status, STATUS.badRequest);
        });

        it("Should not return any word (09, common)", async () => {
            params.uri = wordURL + "09?rarety=common";
            const apiResponse: ApiResponseWord = await request(params).promise();
            assert.equal(apiResponse.status, STATUS.badRequest);
        });

        it("Should not return any word (09, uncommon)", async () => {
            params.uri = wordURL + "09?rarety=uncommon";
            const apiResponse: ApiResponseWord = await request(params).promise();
            assert.equal(apiResponse.status, STATUS.badRequest);
        });
    });
    describe("Words", () => {
        it("Should return an array of 2 letter word (**)",  async () => {
            params.uri = wordsURL + "**?rarety=common";
            const apiResponse: ApiResponseWords = await request(params).promise();
            assert.equal(apiResponse.words.length >= 1, true);
        });

        it("Should return an array only with the word on (on)",  async () => {
            params.uri = wordsURL + "on?rarety=common";
            const apiResponse: ApiResponseWords = await request(params).promise();
            assert.equal(apiResponse.words[0], "on");
        });

        it("Should not return any array (a)", async () => {
            params.uri = wordsURL + "a?rarety=common";
            const apiResponse: ApiResponseWords = await request(params).promise();
            assert.equal(apiResponse.status, STATUS.badRequest);
        });
    });
    describe("Definition", () => {
        it("Should not return any definition (xz,easy)", async () => {
            params.uri = definitionURL + "xz?difficulty=easy";
            const apiResponse: ApiResponseWord = await request(params).promise();
            assert.equal(apiResponse.status, STATUS.badRequest);
        }).timeout(5000);

        it("Should not return any definition (xz,hard)", async () => {
            params.uri = definitionURL + "xz?difficulty=hard";
            const apiResponse: ApiResponseWord = await request(params).promise();
            assert.equal(apiResponse.status, STATUS.badRequest);
        }).timeout(5000);

        it("Should return the first definition of the word (ok, easy)", async() => {
            params.uri = definitionURL + "ok?difficulty=easy";
            const expectedDefinition: string = "an endorsement";
            const apiResponse: ApiResponseDefinition = await request(params).promise();
            assert.equal(apiResponse.definition, expectedDefinition);
        }).timeout(5000);

        it("Should return the second definition of the word (test, hard)", async() => {
            params.uri = definitionURL + "test?difficulty=hard";
            const expectedDefinition: string = "the act of undergoing testing";
            const apiResponse: ApiResponseDefinition = await request(params);
            assert.equal(apiResponse.definition, expectedDefinition);
        }).timeout(5000);

        it("Should return the first definition because there is no second (twenty, hard)", async() => {
            params.uri = definitionURL + "twenty?difficulty=hard";
            const expectedDefinition: string = "a United States bill worth 20 dollars";
            const apiResponse: ApiResponseDefinition = await request(params);
            assert.equal(apiResponse.definition, expectedDefinition);
        }).timeout(5000);
    });
});
