export type Bytes = Buffer | Uint8Array | string;
export declare function toBuffer(value: Bytes, encoding?: BufferEncoding): Buffer;
export declare function toBase64Url(value: Buffer): string;
export declare function fromBase64Url(value: string): Buffer;
export declare function assertNonEmptyString(value: unknown, name: string): asserts value is string;
//# sourceMappingURL=encoding.d.ts.map