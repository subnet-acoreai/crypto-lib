import { type BinaryToTextEncoding } from "node:crypto";
import { type Bytes } from "./encoding.js";
export declare const DEFAULT_HASH_ALGORITHM = "sha256";
export type HashEncoding = BinaryToTextEncoding;
export interface HashOptions {
    algorithm?: string;
    encoding?: HashEncoding;
}
/**
 * Hash data with a Node.js digest algorithm. Defaults to SHA-256 hex.
 */
export declare function hash(data: Bytes, options?: HashOptions): string;
/**
 * Stream a file from disk and return its digest. Useful for large payloads.
 */
export declare function hashFile(filePath: string, options?: HashOptions): Promise<string>;
//# sourceMappingURL=hash.d.ts.map