export class CryptoLibError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.name = "CryptoLibError";
        this.code = code;
    }
}
export function fail(message, code) {
    throw new CryptoLibError(message, code);
}
//# sourceMappingURL=errors.js.map