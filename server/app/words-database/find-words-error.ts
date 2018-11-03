
export class FindWordsError extends Error {
    public constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, FindWordsError.prototype);
    }
}
