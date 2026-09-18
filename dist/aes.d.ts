import { type Bytes } from "./encoding.js";
export declare const AES_KEY_BYTES = 32;
export declare const AES_IV_BYTES = 12;
export declare const AES_TAG_BYTES = 16;
export interface AesOptions {
    aad?: Bytes;
}
/**
 * Generate a 256-bit AES key.
 */
export declare function generateKey(): Buffer;
/**
 * Encrypt with AES-256-GCM. Returns a versioned, URL-safe payload:
 * `c1.<iv>.<tag>.<ciphertext>`
 */
export declare function encrypt(plaintext: Bytes, key: Bytes, options?: AesOptions): string;
/**
 * Decrypt a payload produced by {@link encrypt}. Returns raw bytes.
 */
export declare function decrypt(payload: Bytes, key: Bytes, options?: AesOptions): Buffer;
/**
 * Decrypt and decode UTF-8 text.
 */
export declare function decryptUtf8(payload: string, key: Bytes, options?: AesOptions): string;
//# sourceMappingURL=aes.d.ts.map