import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/glossia/" : "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        translator: resolve(__dirname, "translator/index.html"),
        categories: resolve(__dirname, "categories/index.html"),
        flashcards: resolve(__dirname, "flashcards/index.html"),
        favorite_words: resolve(__dirname, "favorite_words/index.html"),
      },
    },
  },
});
