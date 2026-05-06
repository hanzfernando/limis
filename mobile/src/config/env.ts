console.log("RAW ENV:", process.env.EXPO_PUBLIC_API_BASE_URL);

const FALLBACK_API_BASE_URL = "http://localhost:8000/api";
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? FALLBACK_API_BASE_URL;
