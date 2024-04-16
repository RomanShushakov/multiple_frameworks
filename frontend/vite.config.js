import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { imagetools } from "vite-imagetools";
import vue from "@vitejs/plugin-vue";
import { angular } from "@nitedani/vite-plugin-angular/plugin";


export default defineConfig({
  server: {
    port: 5001,
  },
  build: {
    outDir: "./web_server/static",    // by some reason will build into ./web_server/static/client folder
    assetsDir: "./assets",
    rollupOptions: {
      input: {
        index: "./index.html",
        login: "./login.html",
        vue: "./vue.html",
        svelte: "./svelte.html",
        angular: "./angular.html",
      },
    },
  },
  plugins: [
    imagetools(),
    svelte(),
    vue(),
    angular(),
  ],
});
