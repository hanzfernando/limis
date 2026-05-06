import * as Argon2 from "@sphereon/react-native-argon2";

const ARGON2_ID = 2;

// Get hash function with fallback support
const getHashFunction = () => {
  const argon2Module = Argon2 as any;
  // Try multiple import patterns
  return argon2Module.hash || argon2Module.default?.hash || argon2Module;
};

export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const hashFn = getHashFunction();
  
  if (typeof hashFn !== "function" && typeof hashFn.hash !== "function") {
    throw new Error(
      "Argon2 hash function not available. Check @sphereon/react-native-argon2 installation."
    );
  }

  const result = await (typeof hashFn === "function" ? hashFn : hashFn.hash)({
    pass: password,
    salt,
    type: ARGON2_ID,
    time: 3,
    mem: 65536,
    parallelism: 4,
    hashLen: 32,
  });

  const rawKey =
    result.hash instanceof Uint8Array
      ? result.hash
      : fromBase64(result.hash as unknown as string);

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
  return (globalThis.crypto as any).getRandomValues(new Uint8Array(16));
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

function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(u8.byteLength);
  new Uint8Array(buffer).set(u8);
  return buffer;
}
