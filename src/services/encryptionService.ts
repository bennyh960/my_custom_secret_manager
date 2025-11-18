import { SecretsContextType } from "../contexts/secretContext/types";

const encryptionService = {
  async deriveKey(password: string, salt: Uint8Array<ArrayBuffer>) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const importedKey = await crypto.subtle.importKey("raw", passwordBuffer, "PBKDF2", false, [
      "deriveBits",
      "deriveKey",
    ]);

    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      importedKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  },

  async encrypt(data: SecretsContextType["userSecretData"], password: string) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(password, salt);

    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));

    const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, encodedData);

    const result = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(new Uint8Array(encryptedData), salt.length + iv.length);

    return btoa(String.fromCharCode(...result));
  },

  async decrypt(encryptedString: string, password: string) {
    const encryptedData = Uint8Array.from(atob(encryptedString), (c) => c.charCodeAt(0));

    const salt = encryptedData.slice(0, 16);
    const iv = encryptedData.slice(16, 28);
    const data = encryptedData.slice(28);

    const key = await this.deriveKey(password, salt);

    const decryptedData = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, data);

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedData));
  },
};

export default encryptionService;
