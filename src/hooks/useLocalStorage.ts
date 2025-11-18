import { useState } from "react";
import { storageMap } from "../utils/constants";

//#region useLocalStorage
// Map keys to the expected value type
type StorageValueMap = {
  db_oatuh_pkce_verifier: string;
  db_refresh_token: string;
  db_access_token: string;
  db_access_token_expires: number;
  login_retries: number;
  login_lockout_time: number;
  sessionStorage_user_path: string;
};

type StorageKey = keyof typeof storageMap;

//#endregion

function useLocalStorage<K extends StorageKey>(
  key: K,
  initialValue: StorageValueMap[K]
): [StorageValueMap[K], (value: StorageValueMap[K] | ((prev: StorageValueMap[K]) => StorageValueMap[K])) => void] {
  const [storedValue, setStoredValue] = useState<StorageValueMap[K]>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}": `, error);
      return initialValue;
    }
  });

  const setValue = (value: StorageValueMap[K] | ((prev: StorageValueMap[K]) => StorageValueMap[K])) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}": `, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
