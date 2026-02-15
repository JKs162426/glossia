import { loadHeaderFooter } from "./templates.mjs";
import { applyLanguage } from "./applyLanguage.js";
import { toggleLang } from "./language.js";
import { initTargetLanguageSelector } from "./targetLanguageUI.js";
import { getTargetLang, setTargetLang } from "./targetLanguage.js";

const KEY = "glossia_favorites_v1";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  applyLanguage();
  wireHeaderLangToggle();

  // selector idioma objetivo (10 idiomas)
  initTargetLanguageSelector();

  wireFavoritesUI();
  renderFavorites();
});

function wireHeaderLangToggle() {
  const btn = document.querySelector("#lang-toggle");
  btn?.addEventListener("click", () => {
    toggleLang();
    applyLanguage();
    applyPlaceholders();
  });
}

function wireFavoritesUI() {
  const form = document.querySelector("#fav-form");
  const search = document.querySelector("#search");
  const targetSelect = document.querySelector("#target-lang");

  // Cuando cambias target language, re-render para filtrar por idioma
  targetSelect?.addEventListener("change", () => {
    setTargetLang(targetSelect.value);
    renderFavorites();
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const wordEl = document.querySelector("#fav-word");
    const trEl = document.querySelector("#fav-translation");

    const word = wordEl.value.trim();
    const translation = trEl.value.trim();

    if (!word) return;

    addFavorite({
      word,
      translation,
      targetLang: getTargetLang(),
    });

    wordEl.value = "";
    trEl.value = "";
    renderFavorites();
  });

  search?.addEventListener("input", () => renderFavorites());
  applyPlaceholders();
}

function applyPlaceholders() {
  // si quieres, luego lo integras a applyLanguage (placeholder)
  // por ahora no rompe nada.
}

export function addFavorite(item) {
  const favorites = getFavorites();

  // evitar duplicados por word + targetLang
  const exists = favorites.some(
    (f) =>
      f.word.toLowerCase() === item.word.toLowerCase() &&
      f.targetLang === item.targetLang
  );
  if (exists) return;

  favorites.unshift({
    id: crypto.randomUUID(),
    word: item.word,
    translation: item.translation || "",
    targetLang: item.targetLang,
    createdAt: new Date().toISOString(),
  });

  saveFavorites(favorites);
}

function removeFavorite(id) {
  const favorites = getFavorites().filter((f) => f.id !== id);
  saveFavorites(favorites);
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function saveFavorites(favs) {
  localStorage.setItem(KEY, JSON.stringify(favs));
}

function renderFavorites() {
  const list = document.querySelector("#favorites-list");
  if (!list) return;

  const search = (document.querySelector("#search")?.value || "").toLowerCase();
  const target = getTargetLang();

  const favorites = getFavorites()
    .filter((f) => f.targetLang === target)
    .filter((f) => {
      if (!search) return true;
      return (
        f.word.toLowerCase().includes(search) ||
        (f.translation || "").toLowerCase().includes(search)
      );
    });

  if (!favorites.length) {
    list.innerHTML = `<p class="muted">No favorites yet.</p>`;
    return;
  }

  list.innerHTML = favorites
    .map(
      (f) => `
      <div class="favorite-item">
        <div>
          <div class="fav-word"><strong>${escapeHtml(f.word)}</strong></div>
          <div class="fav-translation">${escapeHtml(f.translation || "")}</div>
          <div class="fav-meta">${escapeHtml(f.targetLang.toUpperCase())}</div>
        </div>
        <button class="danger" data-remove="${f.id}" type="button">✕</button>
      </div>
    `
    )
    .join("");

  list.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFavorite(btn.dataset.remove);
      renderFavorites();
    });
  });
}

function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[m])
  );
}
