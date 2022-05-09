import { defineConfig } from "vite";

export default defineConfig({
  publicDir: "./static",
  build: {
    minify: false,
  },
  server: {
    host: "0.0.0.0",
    /*hmr: {
      port: 443,
      host: "localhost",
    },*/
  },
});
