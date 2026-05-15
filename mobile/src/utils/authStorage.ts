import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "limis_auth_token";

async function canUseSecureStore() {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function saveAuthToken(token: string) {
  if (await canUseSecureStore()) {
    try {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      return;
    } catch {
      // Fall through to AsyncStorage when native secure store fails at runtime.
    }
  }

  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function getAuthToken() {
  if (await canUseSecureStore()) {
    try {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

      if (token) {
        return token;
      }
    } catch {
      // Fall through to AsyncStorage when native secure store fails at runtime.
    }
  }

  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

export async function clearAuthToken() {
  if (await canUseSecureStore()) {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    } catch {
      // Continue and clear fallback storage as well.
    }
  }

  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}
