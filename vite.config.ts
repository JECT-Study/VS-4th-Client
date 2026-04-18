import path from "node:path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: "./src/pages/routes",
      generatedRouteTree: "./src/app/config/routeTree.gen.ts",
    }),
    viteReact(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      injectRegister: false,
      pwaAssets: {
        config: true,
        overrideManifestIcons: false,
      },
      manifest: {
        name: "VS",
        short_name: "VS",
        description: "VS",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#FAFAFA",
        theme_color: "#FAFAFA",
        icons: [
          { src: "assets/images/app/pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "assets/images/app/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "assets/images/app/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "assets/images/app/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,webp,avif}"],
        globIgnores: ["assets/images/app/**/*"],
      },
      devOptions: {
        enabled: false,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./src/app"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@base": path.resolve(__dirname, "./src/base"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  build: { sourcemap: true },
});
