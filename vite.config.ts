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
        icons: [{ src: "assets/images/logo_118x118.png", sizes: "118x118", type: "image/png" }],
      },
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,webp,avif}"],
        globIgnores: ["assets/images/app/**/*"],
      },
      devOptions: {
        enabled: true,
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
  preview: {
    port: 3000,
    strictPort: true,
  },
  build: { sourcemap: true },
  define: {
    global: "globalThis",
  },
});
