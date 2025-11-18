export const DROPBOX_CLIENT_ID = import.meta.env.VITE_DROPBOX_CLIENT_ID;
export const NODE_ENV = import.meta.env.VITE_NODE_ENV;
export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const storageMap = {
  db_oatuh_pkce_verifier: "pkce_verifier",
  db_refresh_token: "db_refresh_token",
  db_access_token: "db_access_token",
  db_access_token_expires: "db_access_token_expires",
  login_retries: "login_retries",
  login_lockout_time: "login_lockout_time",
  sessionStorage_user_path: "userPath",
} as const;

export const routes = {
  dropboxAuthCallback: "",
  test: "/test",
};

export const colorMap = {
  red: "bg-red-100 text-red-700",
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  yellow: "bg-yellow-100 text-yellow-700",
};
