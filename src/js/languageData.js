export const popularLanguages = [
  { code: "en", name: "English 🇺🇸/🇬🇧" },
  { code: "es", name: "Español 🇪🇸/🇲🇽" },
  { code: "fr", name: "Français 🇫🇷" },
  { code: "de", name: "Deutsch 🇩🇪" },
  { code: "it", name: "Italiano 🇮🇹" },
  { code: "pt", name: "Português 🇧🇷/🇵🇹" },
  { code: "zh", name: "中文 (Chinese) 🇨🇳" },
  { code: "ja", name: "日本語 (Japanese) 🇯🇵" },
  { code: "ko", name: "한국어 (Korean) 🇰🇷" },
  { code: "ru", name: "Русский (Russian) 🇷🇺" },
];

const KEY = "glossia_target_lang";

export function getTargetLang() {
  return localStorage.getItem(KEY) || "en";
}

export function setTargetLang(code) {
  localStorage.setItem(KEY, code);
}
