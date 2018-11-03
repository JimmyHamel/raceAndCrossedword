
export class SaveWordsError extends Error {
    public constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, SaveWordsError.prototype);
    }
}
