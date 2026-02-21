import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@ruby/wasm-wasi/dist/esm/browser.js": path.resolve(
        "node_modules/@ruby/wasm-wasi/dist/esm/browser.js"
      ),
    },
  },
  optimizeDeps: {
    exclude: ["@ruby/wasm-wasi", "@ruby/4.0-wasm-wasi"],
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
