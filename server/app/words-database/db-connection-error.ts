export class DBConnectionError extends Error {
    public constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, DBConnectionError.prototype);
    }

}
