import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [{ src: "static/*", dest: "static" }],
      }),
    ],
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
  };
});
