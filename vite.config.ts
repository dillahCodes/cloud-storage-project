import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import Checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [react(), Checker({ typescript: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
});
