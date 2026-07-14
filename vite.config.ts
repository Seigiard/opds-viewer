import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  publicDir: "static",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssMinify: false,
    rollupOptions: {
      output: {
        assetFileNames: "static/[name][extname]",
        entryFileNames: "static/[name].js",
        chunkFileNames: "static/[name].js",
      },
    },
  },
});
