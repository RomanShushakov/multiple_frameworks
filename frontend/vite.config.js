import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { imagetools } from "vite-imagetools";
import vue from "@vitejs/plugin-vue";


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
  ],
});
