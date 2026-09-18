export class CryptoLibError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "CryptoLibError";
    this.code = code;
  }
}

export function fail(message: string, code: string): never {
  throw new CryptoLibError(message, code);
}
