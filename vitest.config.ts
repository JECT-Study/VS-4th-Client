import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));
const r = (dir: string) => resolve(root, dir);

export default defineConfig({
  resolve: {
    alias: {
      "@app": r("src/app"),
      "@pages": r("src/pages"),
      "@layouts": r("src/layouts"),
      "@features": r("src/features"),
      "@base": r("src/base"),
      "@": r("src"),
    },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "jsdom",
  },
});
