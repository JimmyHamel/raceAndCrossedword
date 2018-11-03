const MILLISECOND_IN_CENTISECOND: number = 10;
const CENTISECOND_IN_SECOND: number = 100;
const SECOND_IN_MINUTE: number = 60;
const LIMIT_FORMAT: number = 10;

export class TimeFormat {

    private static formatNumber(num: number): string {
        if (num < LIMIT_FORMAT) {
            return "0" + num.toString()[0];
        } else {
            return num.toString()[0] + num.toString()[1];
        }
    }
    private static calculateCentiSecond(time: number): number {
        return (Math.floor(time) / MILLISECOND_IN_CENTISECOND) % CENTISECOND_IN_SECOND;
    }
    private static calculateSecond(time: number): number {
        return (Math.floor(time) / (MILLISECOND_IN_CENTISECOND * CENTISECOND_IN_SECOND)) % SECOND_IN_MINUTE;
    }
    private static calculateMinute(time: number): number {
        return Math.floor(time) / (MILLISECOND_IN_CENTISECOND * CENTISECOND_IN_SECOND * SECOND_IN_MINUTE);
    }

    public static csToString(num: number): string {
        return this.formatNumber(this.calculateMinute(num)) + ":" +
            this.formatNumber(this.calculateSecond(num)) + ":" +
            this.formatNumber(this.calculateCentiSecond(num));
    }
}
