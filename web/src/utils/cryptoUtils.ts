import { hash } from "argon2-wasm";
import type { EncryptedVaultPayload, VaultCredential } from "../types/Vault";

const IV_LENGTH_BYTES = 12;
const SALT_LENGTH_BYTES = 32;

const ARGON2_CONFIG = {
  type: 2, // Argon2id
  time: 3,
  mem: 65536,
  parallelism: 4,
  hashLen: 32,
} as const;

export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const result = await hash({
    pass: password,
    salt,
    ...ARGON2_CONFIG,
  });

  return crypto.subtle.importKey(
    "raw",
    toArrayBuffer(result.hash),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES));
}

export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES));
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
  const encrypted = await encryptBytes(plaintext, key, iv);

  return {
    ciphertext: toBase64(encrypted),
    iv: toBase64(iv),
    salt: toBase64(salt),
  };
}

export async function decryptVaultData(
  ciphertext: string,
  ivBase64: string,
  saltBase64: string,
  password: string
): Promise<VaultCredential[]> {
  if (!ciphertext || !ivBase64 || !saltBase64) {
    console.warn("Empty vault content - skipping decryption.");
    return [];
  }

  const iv = fromBase64(ivBase64);
  const salt = fromBase64(saltBase64);
  const encryptedBytes = fromBase64(ciphertext);
  const key = await deriveKeyFromPassword(password, salt);

  try {
    const decrypted = await decryptBytes(encryptedBytes, key, iv);
    return decodeJson<VaultCredential[]>(decrypted);
  } catch (err) {
    console.error("Decryption failed:", err);
    throw new Error("Failed to decrypt vault. Please check your password.");
  }
}

export async function reencryptVault(
  name: string,
  desc: string,
  credentials: VaultCredential[],
  password: string
): Promise<EncryptedVaultPayload> {
  const { ciphertext, iv, salt } = await encryptVaultData(credentials, password);

  return {
    name,
    desc,
    ciphertext,
    iv,
    salt,
  };
}

async function encryptBytes(
  plaintext: Uint8Array,
  key: CryptoKey,
  iv: Uint8Array
): Promise<Uint8Array> {
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: toArrayBuffer(iv) },
    key,
    toArrayBuffer(plaintext)
  );

  return new Uint8Array(encrypted);
}

async function decryptBytes(
  encryptedBytes: Uint8Array,
  key: CryptoKey,
  iv: Uint8Array
): Promise<Uint8Array> {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: toArrayBuffer(iv) },
    key,
    toArrayBuffer(encryptedBytes)
  );

  return new Uint8Array(decrypted);
}

function encodeJson(data: unknown): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(data));
}

function decodeJson<T>(bytes: Uint8Array): T {
  return JSON.parse(new TextDecoder().decode(toArrayBuffer(bytes)));
}

function toBase64(u8: Uint8Array): string {
  return btoa(String.fromCharCode(...u8));
}

function fromBase64(str: string): Uint8Array {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(u8.byteLength);
  new Uint8Array(buffer).set(u8);
  return buffer;
}
