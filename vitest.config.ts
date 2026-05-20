import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

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
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // 오프라인 캐싱을 위해 경로 업데이트
      includeAssets: ["assets/images/app/favicon.ico"],
      manifest: {
        name: "서비스의 실제 이름",
        short_name: "앱이름",
        description: "서비스에 대한 설명",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          // 실제 파일이 있는 경로로 수정
          {
            src: "/assets/images/app/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/assets/images/app/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          // 폴더에 있는 마스커블 아이콘 추가 (안드로이드 최적화)
          {
            src: "/assets/images/app/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "jsdom",
  },
});