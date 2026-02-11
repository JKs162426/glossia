import { popularLanguages } from "./languageData.js";
import { getTargetLang, setTargetLang } from "./targetLanguage.js";

export function initTargetLanguageSelector() {
  const select = document.querySelector("#target-lang");
  if (!select) return;

  select.innerHTML = popularLanguages
    .map((l) => `<option value="${l.code}">${l.name}</option>`)
    .join("");

  select.value = getTargetLang();

  select.addEventListener("change", () => {
    setTargetLang(select.value);
    console.log("Target language set to:", select.value);
  });
}
