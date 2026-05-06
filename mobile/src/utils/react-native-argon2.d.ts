// src/types/sphereon-react-native-argon2.d.ts

declare module "@sphereon/react-native-argon2" {
  export interface Argon2Config {
    iterations?: number;
    memory?: number;
    parallelism?: number;
    hashLength?: number;
    mode?: "argon2d" | "argon2i" | "argon2id";
  }

  export interface Argon2Result {
    rawHash: string;
    encodedHash: string;
  }

  export default function argon2(
    password: string,
    salt: string,
    config: Argon2Config
  ): Promise<Argon2Result>;
}
