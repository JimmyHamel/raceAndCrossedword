export class SoundError extends Error {
    public constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, SoundError.prototype);
    }
}
