import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), checker({ typescript: true })],
  base: "/my_custom_secret_manager/",
  server: {
    port: 5173,
    proxy: {
      "/paypal": "http://localhost:3000/",
      "/server-test": "http://localhost:3000/",
    },
  },
});
