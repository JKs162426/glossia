import { loadHeaderFooter } from "./templates.mjs";
import { applyLanguage } from "./applyLanguage.js";
import { translations } from "./i18n.js";
import { getLang, toggleLang } from "./language.js";
import { getTargetLang } from "./languageData.js";
import { categorySeeds } from "./categoriesData.js";
import { translateText } from "../services/translateService.js";
import { initTargetLanguageSelector } from "./targetLanguageUI.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  applyLanguage();
  renderCategories();
  initTargetLanguageSelector();
});

function renderCategories() {
  const container = document.querySelector("#categories-list");
  const lang = getLang();

  container.innerHTML = Object.keys(categorySeeds)
    .map(
      (id) => `
      <li class="category-item" data-id="${id}">
        ${translations[lang].categories.list[id]}
      </li>
    `
    )
    .join("");

  document.querySelectorAll(".category-item").forEach((item) => {
    item.addEventListener("click", () => {
      loadCategory(item.dataset.id);
    });
  });
}

async function loadCategory(categoryId) {
  const target = getTargetLang();
  const words = categorySeeds[categoryId];
  const output = document.querySelector("#category-words");

  output.innerHTML = "Loading...";

  const translated = await Promise.all(
    words.map((word) => translateText({ text: word, from: "en", to: target }))
  );

  output.innerHTML = translated
    .map(
      (t, i) => `
      <div class="word-item">
        <strong>${words[i]}</strong> → ${t.translatedText}
      </div>
    `
    )
    .join("");
}
