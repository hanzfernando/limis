import type { EncryptedVaultPayload, VaultCredential } from "../types/Vault";
import { hash } from "argon2-wasm";

export async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
const result = await hash({
    pass: password,
    salt,
    type: 2,             // Argon2id
    time: 3,             // iterations
    mem: 65536,          // 64MB
    parallelism: 4,      // match multi-core systems
    hashLen: 32,
  });

  return crypto.subtle.importKey(
    "raw",
    result.hash,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

// export async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
//   const encoder = new TextEncoder();
//   const keyMaterial = await crypto.subtle.importKey(
//     "raw",
//     encoder.encode(password),
//     { name: "PBKDF2" },
//     false,
//     ["deriveKey"]
//   );

//   return crypto.subtle.deriveKey(
//     {
//       name: "PBKDF2",
//       salt,
//       iterations: 100_000,
//       hash: "SHA-256",
//     },
//     keyMaterial,
//     { name: "AES-GCM", length: 256 },
//     false,
//     ["encrypt", "decrypt"]
//   );
// }

export function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(12));
}

export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

export async function encryptVaultData(data: object, password: string): Promise<{
  ciphertext: string;
  iv: string;
  salt: string;
}> {
  const iv = generateIV();
  const salt = generateSalt();
  const key = await deriveKeyFromPassword(password, salt);

  const encoder = new TextEncoder();
  const encoded = encoder.encode(JSON.stringify(data));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return {
    iv: toBase64(iv),
    salt: toBase64(salt),
    ciphertext: toBase64(new Uint8Array(encrypted)),
  };
}

export async function decryptVaultData(
  ciphertext: string,
  ivBase64: string,
  saltBase64: string,
  password: string
): Promise<VaultCredential[]> {
  if (!ciphertext || !ivBase64 || !saltBase64) {
    console.warn("Empty vault content — skipping decryption.");
    return [];
  }

  const decoder = new TextDecoder();
  const iv = fromBase64(ivBase64);
  const salt = fromBase64(saltBase64);
  const encryptedBytes = fromBase64(ciphertext);
  const key = await deriveKeyFromPassword(password, salt);

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedBytes
    );

    return JSON.parse(decoder.decode(decrypted));
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
  const iv = generateIV();
  const salt = generateSalt();
  const key = await deriveKeyFromPassword(password, salt);

  const encoder = new TextEncoder();
  const encoded = encoder.encode(JSON.stringify(credentials));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);

  return {
    name,
    desc,
    ciphertext: toBase64(new Uint8Array(encrypted)),
    iv: toBase64(iv),
    salt: toBase64(salt),
  };
}

function toBase64(u8: Uint8Array): string {
  return btoa(String.fromCharCode(...u8));
}

function fromBase64(str: string): Uint8Array {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

