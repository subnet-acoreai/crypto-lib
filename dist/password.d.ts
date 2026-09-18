export interface HashPasswordOptions {
    n?: number;
    r?: number;
    p?: number;
}
/**
 * Hash a password with scrypt. The returned string is self-contained and
 * includes algorithm parameters, salt, and derived key.
 *
 * Format: `scrypt$n$r$p$saltHex$keyHex`
 */
export declare function hashPassword(password: string, options?: HashPasswordOptions): Promise<string>;
/**
 * Verify a password against a hash produced by {@link hashPassword}.
 */
export declare function verifyPassword(password: string, storedHash: string): Promise<boolean>;
//# sourceMappingURL=password.d.ts.map