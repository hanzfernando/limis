declare module "argon2-wasm" {
  export interface Argon2Options {
    pass: string | Uint8Array;
    salt: Uint8Array;
    time?: number;
    mem?: number;
    parallelism?: number;
    hashLen?: number;
    type?: number; // 0 = Argon2d, 1 = Argon2i, 2 = Argon2id
  }

  export interface Argon2HashResult {
    hash: Uint8Array;
    hashHex: string;
    encoded: string;
  }

  export function hash(options: Argon2Options): Promise<Argon2HashResult>;
}
