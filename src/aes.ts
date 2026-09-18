import { createCipheriv, createDecipheriv } from "node:crypto";
import { CryptoLibError, fail } from "./errors.js";
import { fromBase64Url, toBase64Url, toBuffer, type Bytes } from "./encoding.js";
import { randomBytes } from "./random.js";

export const AES_KEY_BYTES = 32;
export const AES_IV_BYTES = 12;
export const AES_TAG_BYTES = 16;
const PAYLOAD_VERSION = "c1";
const ALGORITHM = "aes-256-gcm";

export interface AesOptions {
  aad?: Bytes;
}

function normalizeKey(key: Bytes): Buffer {
  let material: Buffer;

  if (typeof key === "string") {
    if (/^[0-9a-f]+$/i.test(key) && key.length === AES_KEY_BYTES * 2) {
      material = Buffer.from(key, "hex");
    } else {
      material = Buffer.from(key, "base64url");
      if (material.length !== AES_KEY_BYTES) {
        material = Buffer.from(key, "base64");
      }
    }
  } else {
    material = toBuffer(key);
  }

  if (material.length !== AES_KEY_BYTES) {
    fail(`AES-256-GCM key must be ${AES_KEY_BYTES} bytes`, "INVALID_KEY");
  }

  return material;
}

function optionalAad(aad: Bytes | undefined): Buffer | undefined {
  if (aad === undefined) {
    return undefined;
  }
  return toBuffer(aad);
}

/**
 * Generate a 256-bit AES key.
 */
export function generateKey(): Buffer {
  return randomBytes(AES_KEY_BYTES);
}

/**
 * Encrypt with AES-256-GCM. Returns a versioned, URL-safe payload:
 * `c1.<iv>.<tag>.<ciphertext>`
 */
export function encrypt(plaintext: Bytes, key: Bytes, options: AesOptions = {}): string {
  const iv = randomBytes(AES_IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, normalizeKey(key), iv);
  const aad = optionalAad(options.aad);

  if (aad) {
    cipher.setAAD(aad);
  }

  const ciphertext = Buffer.concat([cipher.update(toBuffer(plaintext)), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [PAYLOAD_VERSION, toBase64Url(iv), toBase64Url(tag), toBase64Url(ciphertext)].join(".");
}

/**
 * Decrypt a payload produced by {@link encrypt}. Returns raw bytes.
 */
export function decrypt(payload: Bytes, key: Bytes, options: AesOptions = {}): Buffer {
  if (typeof payload !== "string") {
    fail("payload must be a string produced by encrypt()", "INVALID_PAYLOAD");
  }

  const parts = payload.split(".");
  if (parts.length !== 4 || parts[0] !== PAYLOAD_VERSION) {
    fail("Unrecognized ciphertext payload", "INVALID_PAYLOAD");
  }

  const [, ivPart, tagPart, ciphertextPart] = parts;
  if (!ivPart || !tagPart || ciphertextPart === undefined) {
    fail("Unrecognized ciphertext payload", "INVALID_PAYLOAD");
  }

  const iv = fromBase64Url(ivPart);
  const tag = fromBase64Url(tagPart);
  const ciphertext = fromBase64Url(ciphertextPart);
  const secret = normalizeKey(key);

  if (iv.length !== AES_IV_BYTES || tag.length !== AES_TAG_BYTES) {
    fail("Ciphertext metadata is invalid", "INVALID_PAYLOAD");
  }

  try {
    const decipher = createDecipheriv(ALGORITHM, secret, iv);
    const aad = optionalAad(options.aad);

    if (aad) {
      decipher.setAAD(aad);
    }

    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  } catch (error) {
    if (error instanceof CryptoLibError) {
      throw error;
    }
    fail("Decryption failed: wrong key, AAD, or tampered data", "DECRYPT_FAILED");
  }
}

/**
 * Decrypt and decode UTF-8 text.
 */
export function decryptUtf8(payload: string, key: Bytes, options: AesOptions = {}): string {
  return decrypt(payload, key, options).toString("utf8");
}
