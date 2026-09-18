import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { fail } from "./errors.js";
import { assertNonEmptyString } from "./encoding.js";

function scrypt(
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keylen, options, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(derivedKey as Buffer);
    });
  });
}

const PREFIX = "scrypt";
const DEFAULT_N = 16_384;
const DEFAULT_R = 8;
const DEFAULT_P = 1;
const KEY_LENGTH = 32;
const SALT_LENGTH = 16;
const MAX_N = 1_048_576;

export interface HashPasswordOptions {
  n?: number;
  r?: number;
  p?: number;
}

function assertPowerOfTwo(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 2 || (value & (value - 1)) !== 0) {
    fail(`${name} must be a power of two >= 2`, "INVALID_INPUT");
  }
}

/**
 * Hash a password with scrypt. The returned string is self-contained and
 * includes algorithm parameters, salt, and derived key.
 *
 * Format: `scrypt$n$r$p$saltHex$keyHex`
 */
export async function hashPassword(
  password: string,
  options: HashPasswordOptions = {},
): Promise<string> {
  assertNonEmptyString(password, "password");

  const n = options.n ?? DEFAULT_N;
  const r = options.r ?? DEFAULT_R;
  const p = options.p ?? DEFAULT_P;

  assertPowerOfTwo(n, "n");
  if (n > MAX_N) {
    fail(`n must be <= ${MAX_N}`, "INVALID_INPUT");
  }
  if (!Number.isInteger(r) || r < 1 || !Number.isInteger(p) || p < 1) {
    fail("r and p must be positive integers", "INVALID_INPUT");
  }

  const salt = randomBytes(SALT_LENGTH);
  const derived = await scrypt(password, salt, KEY_LENGTH, { N: n, r, p });

  return [PREFIX, n, r, p, salt.toString("hex"), derived.toString("hex")].join("$");
}

/**
 * Verify a password against a hash produced by {@link hashPassword}.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  assertNonEmptyString(password, "password");
  assertNonEmptyString(storedHash, "storedHash");

  const parts = storedHash.split("$");
  if (parts.length !== 6 || parts[0] !== PREFIX) {
    fail("Unrecognized password hash format", "INVALID_HASH");
  }

  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const saltHex = parts[4];
  const keyHex = parts[5];

  if (!Number.isInteger(n) || n < 2 || n > MAX_N || (n & (n - 1)) !== 0) {
    fail("Password hash parameters are invalid", "INVALID_HASH");
  }
  if (!Number.isInteger(r) || r < 1 || !Number.isInteger(p) || p < 1) {
    fail("Password hash parameters are invalid", "INVALID_HASH");
  }
  if (!saltHex || !keyHex || saltHex.length % 2 !== 0 || keyHex.length % 2 !== 0) {
    fail("Password hash is malformed", "INVALID_HASH");
  }

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(keyHex, "hex");

  if (salt.length === 0 || expected.length === 0) {
    fail("Password hash is malformed", "INVALID_HASH");
  }

  const actual = await scrypt(password, salt, expected.length, { N: n, r, p });

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}
