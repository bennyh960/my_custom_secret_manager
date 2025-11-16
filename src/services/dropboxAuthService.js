import { BASE_URL, DROPBOX_CLIENT_ID, routes, storageMap } from "../utils/constants";

// ============ Dropbox Auth Service ============
const dropboxAuthService = {
  redirect_uri: BASE_URL + routes.dropboxAuthCallback,
  async authUtilgeneratePKCE() {
    const array = new Uint8Array(64);
    crypto.getRandomValues(array);

    const verifier = Array.from(array)
      .map((byte) => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"[byte % 66])
      .join("");

    // Encode verifier --> SHA-256 hash
    const encoder = new TextEncoder();
    const hash = await crypto.subtle.digest("SHA-256", encoder.encode(verifier));

    // Convert hash to base64url
    const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    return { verifier, challenge };
  },

  async authenticate() {
    const { verifier, challenge } = await this.authUtilgeneratePKCE();

    // Save verifier for the token exchange step
    localStorage.setItem(storageMap.db_oatuh_pkce_verifier, verifier);

    const params = new URLSearchParams({
      client_id: DROPBOX_CLIENT_ID,
      response_type: "code",
      redirect_uri: this.redirect_uri,
      code_challenge: challenge,
      code_challenge_method: "S256",
      token_access_type: "offline",
    });

    // DROPBOX MUST OPEN A NEW TAB / WINDOW
    window.location.href = `https://www.dropbox.com/oauth2/authorize?${params.toString()}`;
  },

  updateStorageData(data) {
    localStorage.setItem(storageMap.db_refresh_token, data.refresh_token);
    localStorage.setItem(storageMap.db_access_token, data.access_token);
    localStorage.setItem(storageMap.db_access_token_expires, Date.now() + data.expires_in * 1000);
  },

  async getAccessToken() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      throw new Error("Authorization code not found in URL parameters.");
    }

    const verifier = localStorage.getItem(storageMap.db_oatuh_pkce_verifier);

    const body = new URLSearchParams({
      code,
      grant_type: "authorization_code",
      client_id: DROPBOX_CLIENT_ID,
      code_verifier: verifier,
      redirect_uri: this.redirect_uri,
    });

    try {
      const res = await fetch("https://api.dropbox.com/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!res.ok) throw new Error(`Dropbox token request failed: ${res.status} , error: ${await res.text()}`);
      const data = await res.json();
      console.log("Token response:", data);

      this.updateStorageData(data);

      return data;
    } catch (error) {
      console.error("Error during token exchange:", error);
      throw error;
    }
  },

  async refreshAccessToken() {
    const refresh_token = localStorage.getItem(storageMap.db_refresh_token);

    if (!refresh_token) {
      this.authenticate();
      // throw new Error("Refresh token not found. Please authenticate again.");
    }

    const body = new URLSearchParams({
      refresh_token,
      grant_type: "refresh_token",
      client_id: DROPBOX_CLIENT_ID,
    });

    try {
      const res = await fetch("https://api.dropbox.com/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!res.ok) throw new Error(`Dropbox refresh token request failed: ${res.status} , error: ${await res.text()}`);

      const data = await res.json();
      console.log("Refresh token response:", data);

      this.updateStorageData(data);

      return data.access_token;
    } catch (error) {
      console.error("Error during token refresh:", error);
      throw error;
    }
  },
  async autoRefreshAccessToken() {
    const token = localStorage.getItem(storageMap.db_access_token);
    const expires = localStorage.getItem(storageMap.db_access_token_expires);

    if (token && Date.now() < Number(expires)) {
      return token;
    }

    return await this.refreshAccessToken();
  },
};

export default dropboxAuthService;
