interface StatusCode {
    badRequest: number;
    successfulRequest: number;
}

export const STATUS: StatusCode = {
    badRequest: 400,
    successfulRequest: 200
};
