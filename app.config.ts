import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import vsharp from "vite-plugin-vsharp";

import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  server: {
    compressPublicAssets: true,
    preset: process.env.BUILD_PRESET,
    routeRules: {
      "/": {
        redirect: {
          to: "/blog",
          statusCode: 301,
        },
      },
      "/robots.txt": {
        redirect: {
          to: "/api/robots",
          statusCode: 301,
        },
      },
      "/sitemap.xml": {
        redirect: {
          to: "/api/sitemap",
          statusCode: 301,
        },
      },
    },
  },
  vite: {
    logLevel: "silent",
    plugins: [
      tailwindcss(),
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      vsharp({
        exclude: ["images/brand.svg"],
        excludePublic: ["images/metadata"],
      }),
    ],
  },
});
