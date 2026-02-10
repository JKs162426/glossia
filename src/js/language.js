const KEY = "glossia_lang";

export function getLang() {
  return localStorage.getItem(KEY) || "en";
}

export function setLang(lang) {
  localStorage.setItem(KEY, lang);
}

export function toggleLang() {
  const next = getLang() === "en" ? "es" : "en";
  setLang(next);
  return next;
}
