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
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
    salt: btoa(String.fromCharCode(...salt)),
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
  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
  const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));
  const key = await deriveKeyFromPassword(password, salt);
  const encryptedBytes = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedBytes
  );

  return JSON.parse(decoder.decode(decrypted));
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
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
    salt: btoa(String.fromCharCode(...salt)),
  };
}
