import { type KeyLike } from "node:crypto";
import { type Bytes } from "./encoding.js";
export interface KeyPair {
    publicKey: string;
    privateKey: string;
}
/**
 * Generate an Ed25519 key pair as PEM strings.
 */
export declare function generateKeyPair(): KeyPair;
/**
 * Sign data with an Ed25519 private key. Returns a base64url signature.
 */
export declare function sign(data: Bytes, privateKey: KeyLike): string;
/**
 * Verify an Ed25519 signature.
 */
export declare function verify(data: Bytes, signature: string, publicKey: KeyLike): boolean;
//# sourceMappingURL=sign.d.ts.map