import { loadHeaderFooter } from "./templates.mjs";
import { applyLanguage } from "./applyLanguage.js";
import { toggleLang, getLang } from "./language.js";
import { initTargetLanguageSelector } from "./targetLanguageUI.js";
import { getTargetLang } from "./targetLanguage.js";
import { popularLanguages } from "./languageData.js";
import { translateText } from "../services/translateService.js";
import { categorySeeds } from "./categoriesData.js"; // el archivo con palabras por categoría

const CACHE_KEY = "glossia_flashcards_cache_v1";

let deck = [];
let index = 0;

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  applyLanguage();
  wireHeaderLangToggle();

  initTargetLanguageSelector(); // llena #target-lang y guarda en localStorage
  initDeckSelector();
  wireUI();

  // intenta cargar deck cacheado
  const cached = loadCache();
  if (cached?.deck?.length) {
    deck = cached.deck;
    index = cached.index ?? 0;
    renderCard();
  }
});

function wireHeaderLangToggle() {
  const btn = document.querySelector("#lang-toggle");
  btn?.addEventListener("click", () => {
    toggleLang();
    applyLanguage();
    updateProgress();
  });
}

function initDeckSelector() {
  const deckSelect = document.querySelector("#deck");
  if (!deckSelect) return;

  deckSelect.innerHTML = Object.keys(categorySeeds)
    .map((id) => `<option value="${id}">${id}</option>`)
    .join("");

  // opcional: mejor nombre con i18n si ya tienes categories.list
  // por ahora id simple; luego lo conectamos a translations
}

function wireUI() {
  const loadBtn = document.querySelector("#load-deck");
  const card = document.querySelector("#card");
  const prev = document.querySelector("#prev");
  const next = document.querySelector("#next");
  const shuffleBtn = document.querySelector("#shuffle");
  const resetBtn = document.querySelector("#reset");

  loadBtn?.addEventListener("click", async () => {
    await buildDeck();
  });

  card?.addEventListener("click", flipCard);
  card?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") flipCard();
  });

  prev?.addEventListener("click", () => {
    if (!deck.length) return;
    setFlipped(false);
    index = (index - 1 + deck.length) % deck.length;
    renderCard();
  });

  next?.addEventListener("click", () => {
    if (!deck.length) return;
    setFlipped(false);
    index = (index + 1) % deck.length;
    renderCard();
  });

  shuffleBtn?.addEventListener("click", () => {
    if (!deck.length) return;
    deck = shuffle(deck);
    index = 0;
    setFlipped(false);
    renderCard();
    saveCache();
  });

  resetBtn?.addEventListener("click", () => {
    deck = [];
    index = 0;
    setFlipped(false);
    renderCard();
    clearCache();
  });
}

async function buildDeck() {
  const deckSelect = document.querySelector("#deck");
  const status = document.querySelector("#progress");

  const categoryId = deckSelect?.value;
  if (!categoryId) return;

  const target = getTargetLang(); // "de", "zh", etc.
  const seeds = categorySeeds[categoryId] || [];

  if (!seeds.length) return;

  status.textContent = getLang() === "es" ? "Cargando..." : "Loading...";

  // traduce seeds EN -> target
  const translated = await Promise.all(
    seeds.map(async (w) => {
      const r = await translateText({ text: w, from: "en", to: target });
      return { front: w, back: r.translatedText };
    })
  );

  deck = translated;
  index = 0;
  setFlipped(false);
  renderCard();
  saveCache();
}

function renderCard() {
  const front = document.querySelector("#frontText");
  const back = document.querySelector("#backText");

  if (!deck.length) {
    front.textContent = getLang() === "es" ? "Sin tarjetas" : "No cards yet";
    back.textContent = getLang() === "es" ? "Crea un deck" : "Build a deck";
    updateProgress();
    return;
  }

  front.textContent = deck[index].front;
  back.textContent = deck[index].back;
  updateProgress();
}

function updateProgress() {
  const el = document.querySelector("#progress");
  if (!el) return;

  if (!deck.length) {
    el.textContent = "";
    return;
  }

  const lang = getLang();
  el.textContent =
    lang === "es"
      ? `Tarjeta ${index + 1} de ${deck.length}`
      : `Card ${index + 1} of ${deck.length}`;
}

function flipCard() {
  const card = document.querySelector("#card");
  if (!card) return;
  card.classList.toggle("flipped");
}

function setFlipped(isFlipped) {
  const card = document.querySelector("#card");
  if (!card) return;
  card.classList.toggle("flipped", isFlipped);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
  } catch {
    return null;
  }
}

function saveCache() {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ deck, index }));
}

function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}
