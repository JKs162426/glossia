const BASE = "https://api.dictionaryapi.dev/api/v2/entries";

export async function getWordInfo({ word, lang = "en" }) {
  const url = `${BASE}/${encodeURIComponent(lang)}/${encodeURIComponent(word)}`;

  const res = await fetch(url);
  if (!res.ok) {
    // dictionaryapi devuelve 404 con body JSON cuando no encuentra
    let msg = `Dictionary API error (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json(); // array
  return normalizeDictionaryResponse(data);
}

function normalizeDictionaryResponse(data) {
  const entry = data?.[0];
  if (!entry) throw new Error("No dictionary results.");

  const phonetic =
    entry.phonetic || entry.phonetics?.find((p) => p?.text)?.text || "";

  const audio = entry.phonetics?.find((p) => p?.audio)?.audio || "";

  const meanings = (entry.meanings || []).map((m) => ({
    partOfSpeech: m.partOfSpeech,
    definitions: (m.definitions || []).map((d) => ({
      definition: d.definition,
      example: d.example || "",
      synonyms: d.synonyms || [],
      antonyms: d.antonyms || [],
    })),
    synonyms: m.synonyms || [],
    antonyms: m.antonyms || [],
  }));

  return {
    word: entry.word,
    phonetic,
    audio,
    meanings,
    raw: entry,
  };
}
