import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
    basePath: "/assets/images/app/",
  },
  preset: {
    ...minimal2023Preset,
    apple: {
      sizes: [],
    },
    appleSplashScreens: {
      padding: 0.3,
      resizeOptions: {
        fit: "contain",
      },
      name: (landscape, size) => {
        const physicalToCss: Record<string, [number, number]> = {
          "750:1334": [375, 667], // iPhone SE
          "1125:2436": [375, 812], // iPhone 13 mini
          "1170:2532": [390, 844], // iPhone 12/13/14/16
          "1284:2778": [428, 926], // iPhone 13/14 Plus
          "1179:2556": [393, 852], // iPhone 14 Pro/15/15 Pro
          "1290:2796": [430, 932], // iPhone 14 Pro Max/15 Plus/16 Plus
          "1206:2622": [402, 874], // iPhone 16 Pro
          "1320:2868": [440, 956], // iPhone 16 Pro Max
        };
        const [pw, ph] = size.width <= size.height ? [size.width, size.height] : [size.height, size.width];
        const [cssW, cssH] = physicalToCss[`${pw}:${ph}`] ?? [pw, ph];
        return landscape
          ? `apple-splash-landscape-light-${cssH}x${cssW}.png`
          : `apple-splash-portrait-light-${cssW}x${cssH}.png`;
      },
      linkMediaOptions: {
        log: true,
        addMediaScreen: true,
        basePath: "/assets/images/app/",
      },
      sizes: [
        { width: 750, height: 1334, scaleFactor: 2 },
        { width: 1125, height: 2436, scaleFactor: 3 },
        { width: 1170, height: 2532, scaleFactor: 3 },
        { width: 1284, height: 2778, scaleFactor: 3 },
        { width: 1179, height: 2556, scaleFactor: 3 },
        { width: 1290, height: 2796, scaleFactor: 3 },
        { width: 1206, height: 2622, scaleFactor: 3 },
        { width: 1320, height: 2868, scaleFactor: 3 },
      ],
    },
  },
  images: ["public/assets/images/app/512x512.png"],
});
