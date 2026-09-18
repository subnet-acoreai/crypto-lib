import {
  randomBytes as nodeRandomBytes,
  randomInt as nodeRandomInt,
  randomUUID as nodeRandomUUID,
} from "node:crypto";
import { fail } from "./errors.js";
import { toBase64Url } from "./encoding.js";

const MAX_BYTES = 65_536;

function assertSize(size: number): void {
  if (!Number.isInteger(size) || size < 1 || size > MAX_BYTES) {
    fail(`size must be an integer between 1 and ${MAX_BYTES}`, "INVALID_INPUT");
  }
}

/**
 * Cryptographically strong random bytes.
 */
export function randomBytes(size: number): Buffer {
  assertSize(size);
  return nodeRandomBytes(size);
}

/**
 * Random bytes encoded as hex.
 */
export function randomHex(size = 32): string {
  return randomBytes(size).toString("hex");
}

/**
 * Random bytes encoded as URL-safe base64.
 */
export function randomBase64Url(size = 32): string {
  return toBase64Url(randomBytes(size));
}

/**
 * Inclusive-min, exclusive-max cryptographically strong integer.
 */
export function randomInt(min: number, max: number): number {
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
export function randomUUID(): string {
  return nodeRandomUUID();
}

/**
 * URL-safe random token. `bytes` is the entropy size, not the string length.
 */
export function randomToken(bytes = 32): string {
  return randomBase64Url(bytes);
}
