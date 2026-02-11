const KEY = "glossia_target_lang";

export function getTargetLang() {
  return localStorage.getItem(KEY) || "en";
}

export function setTargetLang(code) {
  localStorage.setItem(KEY, code);
}
