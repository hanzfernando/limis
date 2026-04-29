// src/types/sphereon-react-native-argon2.d.ts

declare module "@sphereon/react-native-argon2" {
  export type Argon2Type = 0 | 1 | 2;

  export interface Argon2Options {
    pass: string | Uint8Array;
    salt: Uint8Array | string;
    time?: number;
    mem?: number;
    parallelism?: number;
    hashLen?: number;
    type?: Argon2Type;
  }

  export interface Argon2HashResult {
    hash: Uint8Array;
    hashHex?: string;
    encoded?: string;
  }

  export function hash(options: Argon2Options): Promise<Argon2HashResult>;
}