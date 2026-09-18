import { randomBytes as nodeRandomBytes, randomInt as nodeRandomInt, randomUUID as nodeRandomUUID, } from "node:crypto";
import { fail } from "./errors.js";
import { toBase64Url } from "./encoding.js";
const MAX_BYTES = 65_536;
function assertSize(size) {
    if (!Number.isInteger(size) || size < 1 || size > MAX_BYTES) {
        fail(`size must be an integer between 1 and ${MAX_BYTES}`, "INVALID_INPUT");
    }
}
/**
 * Cryptographically strong random bytes.
 */
export function randomBytes(size) {
    assertSize(size);
    return nodeRandomBytes(size);
}
/**
 * Random bytes encoded as hex.
 */
export function randomHex(size = 32) {
    return randomBytes(size).toString("hex");
}
/**
 * Random bytes encoded as URL-safe base64.
 */
export function randomBase64Url(size = 32) {
    return toBase64Url(randomBytes(size));
}
/**
 * Inclusive-min, exclusive-max cryptographically strong integer.
 */
export function randomInt(min, max) {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
        fail("min and max must be integers", "INVALID_INPUT");
    }
    if (max <= min) {
        fail("max must be greater than min", "INVALID_INPUT");
    }
    return nodeRandomInt(min, max);
}
/**
 * RFC 4122 version 4 UUID.
 */
export function randomUUID() {
    return nodeRandomUUID();
}
/**
 * URL-safe random token. `bytes` is the entropy size, not the string length.
 */
export function randomToken(bytes = 32) {
    return randomBase64Url(bytes);
}
//# sourceMappingURL=random.js.map