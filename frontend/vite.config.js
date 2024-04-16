import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { imagetools } from "vite-imagetools";
import vue from "@vitejs/plugin-vue";
import react from "@vitejs/plugin-react";


export default defineConfig({
  server: {
    port: 5001,
  },
  build: {
    outDir: "./web_server/static/client",
    assetsDir: "./assets",
    rollupOptions: {
      input: {
        index: "./index.html",
        login: "./login.html",
        vue: "./vue.html",
        svelte: "./svelte.html",
        react: "./react.html",
      },
    },
  },
  plugins: [
    svelte(),
    imagetools(),
    vue(),
    react(),
  ],
});
