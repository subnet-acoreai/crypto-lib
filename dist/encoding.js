import { fail } from "./errors.js";
export function toBuffer(value, encoding = "utf8") {
    if (Buffer.isBuffer(value)) {
        return value;
    }
    if (value instanceof Uint8Array) {
        return Buffer.from(value);
    }
    if (typeof value === "string") {
        return Buffer.from(value, encoding);
    }
    fail("Value must be a string, Buffer, or Uint8Array", "INVALID_INPUT");
}
export function toBase64Url(value) {
    return value.toString("base64url");
}
export function fromBase64Url(value) {
    if (typeof value !== "string") {
        fail("Expected a base64url string", "INVALID_ENCODING");
    }
    if (value.length === 0) {
        return Buffer.alloc(0);
    }
    return Buffer.from(value, "base64url");
}
export function assertNonEmptyString(value, name) {
    if (typeof value !== "string" || value.length === 0) {
        fail(`${name} must be a non-empty string`, "INVALID_INPUT");
    }
}
//# sourceMappingURL=encoding.js.map