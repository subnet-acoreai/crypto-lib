/**
 * Cryptographically strong random bytes.
 */
export declare function randomBytes(size: number): Buffer;
/**
 * Random bytes encoded as hex.
 */
export declare function randomHex(size?: number): string;
/**
 * Random bytes encoded as URL-safe base64.
 */
export declare function randomBase64Url(size?: number): string;
/**
 * Inclusive-min, exclusive-max cryptographically strong integer.
 */
export declare function randomInt(min: number, max: number): number;
/**
 * RFC 4122 version 4 UUID.
 */
export declare function randomUUID(): string;
/**
 * URL-safe random token. `bytes` is the entropy size, not the string length.
 */
export declare function randomToken(bytes?: number): string;
//# sourceMappingURL=random.d.ts.map