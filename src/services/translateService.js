const DEFAULT_BASE = "http://localhost:5000"; // cámbialo si usas una instancia pública

export async function translateText({
  text,
  from = "en",
  to = "es",
  baseUrl = DEFAULT_BASE,
}) {
  const url = `${baseUrl.replace(/\/$/, "")}/translate`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: from,
      target: to,
      format: "text",
      // api_key: "TU_KEY" // si tu instancia lo requiere
    }),
  });

  if (!res.ok) {
    let msg = `LibreTranslate error (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json();
  return { translatedText: data.translatedText || "" };
}
