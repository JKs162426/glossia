import { translations } from "./i18n.js";
import { getLang } from "./language.js";

function getValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function applyLanguage() {
  const lang = getLang();
  const dict = translations[lang];

  // Cambia textos por data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = getValue(dict, key);
    if (typeof value === "string") el.textContent = value;
  });

  // Actualiza botón
  const btn = document.querySelector("#lang-toggle");
  if (btn) btn.textContent = lang.toUpperCase();

  // (Opcional) cambia atributo lang del HTML
  document.documentElement.lang = lang;
}
