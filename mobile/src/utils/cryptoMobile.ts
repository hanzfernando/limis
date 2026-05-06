import argon2 from "@sphereon/react-native-argon2";

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
): Promise<CryptoKey> {
  if (salt.byteLength !== 32) {
    throw new Error(
      "Sphereon Argon2 requires a 32-byte salt. Encrypt and decrypt must use the same mobile vault config."
    );
  }

  const result = await argon2(password, toHex(salt), ARGON2_CONFIG);

  if (!result.rawHash) {
    throw new Error("Argon2 raw hash not available.");
  }

  const rawKey = fromHex(result.rawHash);

  return (globalThis.crypto as any).subtle.importKey(
    "raw",
    toArrayBuffer(rawKey),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export function generateIV(): Uint8Array {
  return (globalThis.crypto as any).getRandomValues(new Uint8Array(12));
}

export function generateSalt(): Uint8Array {
  return (globalThis.crypto as any).getRandomValues(new Uint8Array(32));
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
  const subtle = (globalThis.crypto as any).subtle;

  if (!subtle) throw new Error("WebCrypto Subtle not available on this platform.");

  const encrypted = await subtle.encrypt(
    { name: "AES-GCM", iv: toArrayBuffer(iv) },
    key,
    toArrayBuffer(encoded)
  );

  return {
    ciphertext: toBase64(new Uint8Array(encrypted)),
    iv: toBase64(iv),
    salt: toBase64(salt),
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

  const decoder = new TextDecoder();
  const iv = fromBase64(ivBase64);
  const salt = fromBase64(saltBase64);
  const encryptedBytes = fromBase64(ciphertext);
  const key = await deriveKeyFromPassword(password, salt);

  try {
    const subtle = (globalThis.crypto as any).subtle;
    if (!subtle) throw new Error("WebCrypto Subtle not available on this platform.");

    const decrypted = await subtle.decrypt(
      { name: "AES-GCM", iv: toArrayBuffer(iv) },
      key,
      toArrayBuffer(encryptedBytes)
    );

    return JSON.parse(decoder.decode(decrypted));
  } catch (err) {
    throw err;
  }
}

function toBase64(u8: Uint8Array): string {
  if (typeof btoa === "function") return btoa(String.fromCharCode(...u8));
  if (typeof Buffer !== "undefined") return Buffer.from(u8).toString("base64");
  throw new Error("No base64 available");
}

function fromBase64(str: string): Uint8Array {
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

function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(u8.byteLength);
  new Uint8Array(buffer).set(u8);
  return buffer;
}
