export const DROPBOX_CLIENT_ID = import.meta.env.VITE_DROPBOX_CLIENT_ID;

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const storageMap = {
  db_oatuh_pkce_verifier: "pkce_verifier",
  db_refresh_token: "db_refresh_token",
  db_access_token: "db_access_token",
  db_access_token_expires: "db_access_token_expires",
  login_retries: "login_retries",
  login_lockout_time: "login_lockout_time",
  sessionStorage_user_path: "userPath",
};

export const routes = {
  dropboxAuthCallback: "/dropbox/callback",
  test: "/test",
};
