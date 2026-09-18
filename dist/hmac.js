import { createHmac } from "node:crypto";
import { fail } from "./errors.js";
import { toBuffer } from "./encoding.js";
import { DEFAULT_HASH_ALGORITHM } from "./hash.js";
/**
 * Compute an HMAC. Defaults to HMAC-SHA-256 hex.
 */
export function hmac(data, key, options = {}) {
    const secret = toBuffer(key);
    if (secret.length === 0) {
        fail("HMAC key must not be empty", "INVALID_KEY");
    }
    const algorithm = options.algorithm ?? DEFAULT_HASH_ALGORITHM;
    const encoding = options.encoding ?? "hex";
    return createHmac(algorithm, secret).update(toBuffer(data)).digest(encoding);
}
//# sourceMappingURL=hmac.js.map