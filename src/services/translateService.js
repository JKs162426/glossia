export async function translateText({ text, from = "en", to = "es" }) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${from}|${to}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Translation error (${res.status})`);
  }

  const data = await res.json();

  return {
    translatedText: data.responseData?.translatedText || "",
  };
}
