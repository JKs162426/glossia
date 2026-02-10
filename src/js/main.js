import { loadHeaderFooter } from "./templates.mjs";
import { toggleLang } from "./language.js";
import { applyLanguage } from "./applyLanguage.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  applyLanguage();

  const btn = document.querySelector("#lang-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      toggleLang();
      applyLanguage();
    });
  }
});
