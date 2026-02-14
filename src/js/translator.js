import { loadHeaderFooter } from "./templates.mjs";
import { applyLanguage } from "./applyLanguage.js";
import { toggleLang } from "./language.js";
import { popularLanguages } from "./languageData.js";
import { translateText } from "../services/translateService.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  applyLanguage();
  wireHeaderLangToggle();

  initTranslator();
});

function wireHeaderLangToggle() {
  const btn = document.querySelector("#lang-toggle");
  btn?.addEventListener("click", () => {
    toggleLang();
    applyLanguage();
    applyTranslatorPlaceholders();
  });
}

function initTranslator() {
  const fromSelect = document.querySelector("#from-lang");
  const toSelect = document.querySelector("#to-lang");
  const source = document.querySelector("#source-text");
  const out = document.querySelector("#translated-text");
  const status = document.querySelector("#status");
  const count = document.querySelector("#char-count");

  const clearBtn = document.querySelector("#clear-btn");
  const copyBtn = document.querySelector("#copy-btn");
  const swapBtn = document.querySelector("#swap-btn");

  fromSelect.innerHTML = popularLanguages
    .map((l) => `<option value="${l.code}">${l.name}</option>`)
    .join("");

  toSelect.innerHTML = popularLanguages
    .map((l) => `<option value="${l.code}">${l.name}</option>`)
    .join("");

  fromSelect.value = "en";
  toSelect.value = "es";

  applyTranslatorPlaceholders();

  const debouncedTranslate = debounce(async () => {
    const text = source.value.trim();
    count.textContent = String(source.value.length);

    if (!text) {
      out.textContent = "";
      status.textContent = "";
      return;
    }

    status.textContent = "…";
    try {
      const res = await translateText({
        text,
        from: fromSelect.value,
        to: toSelect.value,
      });
      out.textContent = res.translatedText || "";
      status.textContent = "";
    } catch (e) {
      status.textContent = "Error";
      out.textContent = "";
      console.error(e);
    }
  }, 400);

  source.addEventListener("input", debouncedTranslate);
  fromSelect.addEventListener("change", debouncedTranslate);
  toSelect.addEventListener("change", debouncedTranslate);

  clearBtn.addEventListener("click", () => {
    source.value = "";
    out.textContent = "";
    status.textContent = "";
    count.textContent = "0";
    source.focus();
  });

  copyBtn.addEventListener("click", async () => {
    const text = out.textContent.trim();
    if (!text) return;
    await navigator.clipboard.writeText(text);
    status.textContent = "Copied";
    setTimeout(() => (status.textContent = ""), 800);
  });

  swapBtn.addEventListener("click", () => {
    const a = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = a;

    const srcText = source.value;
    const outText = out.textContent;
    source.value = outText;
    out.textContent = srcText;

    debouncedTranslate();
  });
}

function applyTranslatorPlaceholders() {
  const el = document.querySelector("[data-i18n-placeholder]");
  if (!el) return;

  const htmlLang = document.documentElement.lang;
  el.placeholder = htmlLang === "es" ? "Escribe aquí..." : "Type here...";
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
