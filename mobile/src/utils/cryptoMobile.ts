import "react-native-get-random-values";
import { gcm } from "@noble/ciphers/aes.js";
import argon2 from "@sphereon/react-native-argon2";

const IV_LENGTH_BYTES = 12;
const SALT_LENGTH_BYTES = 32;

const ARGON2_CONFIG = {
  iterations: 3,
  memory: 65536,
  parallelism: 4,
  hashLength: 32,
  mode: "argon2id",
} as const;

export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<Uint8Array> {
  if (salt.byteLength !== SALT_LENGTH_BYTES) {
    throw new Error(
      "Sphereon Argon2 requires a 32-byte salt. Encrypt and decrypt must use the same mobile vault config."
    );
  }

  const result = await argon2(password, toHex(salt), ARGON2_CONFIG);

  if (!result.rawHash) {
    throw new Error("Argon2 raw hash not available.");
  }

  return fromHex(result.rawHash);
}

export async function deriveVaultKeyFromPassword(
  password: string,
  saltBase64: string
): Promise<Uint8Array> {
  return deriveKeyFromPassword(password, fromBase64(saltBase64));
}

export function generateIV(): Uint8Array {
  return getRandomValues(new Uint8Array(IV_LENGTH_BYTES));
}

export function generateSalt(): Uint8Array {
  return getRandomValues(new Uint8Array(SALT_LENGTH_BYTES));
}

export async function encryptVaultData(
  data: object,
  password: string
): Promise<{
  ciphertext: string;
  iv: string;
  salt: string;
}> {
  const iv = generateIV();
  const salt = generateSalt();
  const key = await deriveKeyFromPassword(password, salt);
  const plaintext = encodeJson(data);
  const encrypted = encryptBytes(plaintext, key, iv);

  return {
    ciphertext: toBase64(encrypted),
    iv: toBase64(iv),
    salt: toBase64(salt),
  };
}

export async function encryptVaultDataWithKey(
  data: object,
  key: Uint8Array
): Promise<{
  ciphertext: string;
  iv: string;
}> {
  const iv = generateIV();
  const plaintext = encodeJson(data);
  const encrypted = encryptBytes(plaintext, key, iv);

  return {
    ciphertext: toBase64(encrypted),
    iv: toBase64(iv),
  };
}

export async function decryptVaultData(
  ciphertext: string,
  ivBase64: string,
  saltBase64: string,
  password: string
): Promise<any[]> {
  if (!ciphertext || !ivBase64 || !saltBase64) {
    return [];
  }

  const iv = fromBase64(ivBase64);
  const salt = fromBase64(saltBase64);
  const encryptedBytes = fromBase64(ciphertext);
  const key = await deriveKeyFromPassword(password, salt);

  try {
    const decrypted = decryptBytes(encryptedBytes, key, iv);
    return decodeJson<any[]>(decrypted);
  } catch (err) {
    throw err;
  }
}

export async function decryptVaultDataWithKey(
  ciphertext: string,
  ivBase64: string,
  key: Uint8Array
): Promise<any[]> {
  if (!ciphertext || !ivBase64) {
    return [];
  }

  const iv = fromBase64(ivBase64);
  const encryptedBytes = fromBase64(ciphertext);

  try {
    const decrypted = decryptBytes(encryptedBytes, key, iv);
    return decodeJson<any[]>(decrypted);
  } catch (err) {
    throw err;
  }
}

function encryptBytes(plaintext: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
  return toUint8Array(gcm(key, iv).encrypt(plaintext));
}

function decryptBytes(encryptedBytes: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
  return toUint8Array(gcm(key, iv).decrypt(encryptedBytes));
}

function encodeJson(data: unknown): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(data));
}

function decodeJson<T>(bytes: Uint8Array): T {
  return JSON.parse(new TextDecoder().decode(toArrayBuffer(bytes)));
}

export function toBase64(u8: Uint8Array): string {
  if (typeof btoa === "function") return btoa(String.fromCharCode(...u8));
  if (typeof Buffer !== "undefined") return Buffer.from(u8).toString("base64");
  throw new Error("No base64 available");
}

export function fromBase64(str: string): Uint8Array {
  if (typeof atob === "function") return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
  if (typeof Buffer !== "undefined") return Uint8Array.from(Buffer.from(str, "base64"));
  throw new Error("No base64 available");
}

function toHex(u8: Uint8Array): string {
  return Array.from(u8, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  return bytes;
}

function getRandomValues(u8: Uint8Array): Uint8Array {
  const crypto = globalThis.crypto;
  if (!crypto?.getRandomValues) {
    throw new Error("Secure random values are not available on this platform.");
  }

  return (crypto.getRandomValues as (array: Uint8Array) => Uint8Array)(u8);
}

function toUint8Array(bytes: ArrayBufferView): Uint8Array {
  if (bytes instanceof Uint8Array) {
    return bytes;
  }

  return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(u8.byteLength);
  new Uint8Array(buffer).set(u8);
  return buffer;
}
