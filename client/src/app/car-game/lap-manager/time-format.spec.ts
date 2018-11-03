/* tslint:disable */
import { TimeFormat } from "./time-format";

describe("Time Format", () => {
    it("Should format centiseconds only", () => {
        expect(TimeFormat.csToString(100)).toBe("00:00:10");
    });
    it("Should format seconds only", () => {
        expect(TimeFormat.csToString(15000)).toBe("00:15:00");
    });
    it("Should format minutes only", () => {
        expect(TimeFormat.csToString(60000)).toBe("01:00:00");
    });
    it("Should format cs and seconds only", () => {
        expect(TimeFormat.csToString(35189)).toBe("00:35:18");
    });
    it("Should be able to have cs > 60", () => {
        expect(TimeFormat.csToString(999)).toBe("00:00:99");
    });
    it("Shouldn't be able to format time > then 1 hour", () => {
        expect(TimeFormat.csToString(3800000)).toBe("63:20:00");
    });
});