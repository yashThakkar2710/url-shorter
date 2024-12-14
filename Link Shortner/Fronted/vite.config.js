import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: true, // Enable HMR
    open: true, // Automatically open the browser on start
    host: "localhost", // Use localhost
    port: 5173, // Use port 3000 (or adjust as necessary)
  },
});
