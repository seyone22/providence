import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
