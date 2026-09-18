import { createHmac, type BinaryToTextEncoding } from "node:crypto";
import { fail } from "./errors.js";
import { toBuffer, type Bytes } from "./encoding.js";
import { DEFAULT_HASH_ALGORITHM } from "./hash.js";

export interface HmacOptions {
  algorithm?: string;
  encoding?: BinaryToTextEncoding;
}

/**
 * Compute an HMAC. Defaults to HMAC-SHA-256 hex.
 */
export function hmac(data: Bytes, key: Bytes, options: HmacOptions = {}): string {
  const secret = toBuffer(key);
  if (secret.length === 0) {
    fail("HMAC key must not be empty", "INVALID_KEY");
  }

  const algorithm = options.algorithm ?? DEFAULT_HASH_ALGORITHM;
  const encoding = options.encoding ?? "hex";

  return createHmac(algorithm, secret).update(toBuffer(data)).digest(encoding);
}
