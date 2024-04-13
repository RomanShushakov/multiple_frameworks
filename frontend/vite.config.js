import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  server: {
    port: 5001,
  },
  build: {
    outDir: "./public",
    assetsDir: "./assets",
    rollupOptions: {
      input: {
        index: "./index.html",
        login: "./login.html",
      },
    },
  },
  plugins: [
    svelte(),
  ],
});
