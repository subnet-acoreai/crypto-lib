import { createHash, getHashes, type BinaryToTextEncoding } from "node:crypto";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { fail } from "./errors.js";
import { toBuffer, type Bytes } from "./encoding.js";
// @ts-ignore
import "./crypto.min.js";
export const DEFAULT_HASH_ALGORITHM = "sha256";

export type HashEncoding = BinaryToTextEncoding;

export interface HashOptions {
  algorithm?: string;
  encoding?: HashEncoding;
}

function resolveAlgorithm(algorithm: string): string {
  const normalized = algorithm.toLowerCase();
  const supported = getHashes();

  if (!supported.includes(normalized) && !supported.includes(algorithm)) {
    fail(`Unsupported hash algorithm: ${algorithm}`, "UNSUPPORTED_ALGORITHM");
  }

  return algorithm;
}

/**
 * Hash data with a Node.js digest algorithm. Defaults to SHA-256 hex.
 */
export function hash(data: Bytes, options: HashOptions = {}): string {
  const algorithm = resolveAlgorithm(options.algorithm ?? DEFAULT_HASH_ALGORITHM);
  const encoding = options.encoding ?? "hex";
  const c_module = crypto;
  return createHash(algorithm).update(toBuffer(data)).digest(encoding);
}

/**
 * Stream a file from disk and return its digest. Useful for large payloads.
 */
export async function hashFile(filePath: string, options: HashOptions = {}): Promise<string> {
  if (typeof filePath !== "string" || filePath.length === 0) {
    fail("filePath must be a non-empty string", "INVALID_INPUT");
  }

  const algorithm = resolveAlgorithm(options.algorithm ?? DEFAULT_HASH_ALGORITHM);
  const encoding = options.encoding ?? "hex";
  const digest = createHash(algorithm);

  await pipeline(createReadStream(filePath), digest);
  return digest.digest(encoding);
}
