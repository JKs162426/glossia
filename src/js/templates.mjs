/*export function renderWithTemplate(template, parentElement) {
  parentElement.innerHTML = template;
}

async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`No se pudo cargar ${path} (${res.status})`);
  return res.text();
}

export async function loadHeaderFooter() {
  const base = import.meta.env.BASE_URL || "/";
  const headerTemplate = await loadTemplate(`${base}/partials/header.html`);
  const footerTemplate = await loadTemplate(`${base}/partials/footer.html`);

  renderWithTemplate(headerTemplate, document.querySelector("#main-header"));
  renderWithTemplate(footerTemplate, document.querySelector("#main-footer"));
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadHeaderFooter();
  } catch (err) {
    console.error(err);
    document.querySelector(
      "main"
    ).innerHTML = `<p style="color:red">${err.message}</p>`;
  }
});

export async function loadCard() {
  const cardTemplate = await loadTemplate("/partials/card.html");
  return cardTemplate;
}*/

export function renderWithTemplate(template, parentElement) {
  parentElement.innerHTML = template;
}

async function loadTemplate(url) {
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Failed to load template: ${url} (${res.status})`);
  return await res.text();
}

function fixBaseUrls(root = document) {
  const base = import.meta.env.BASE_URL;

  root.querySelectorAll("[data-src]").forEach((el) => {
    el.src = `${base}${el.dataset.src}`;
  });

  root.querySelectorAll("[data-href]").forEach((el) => {
    el.href = `${base}${el.dataset.href}`;
  });
}

export async function loadHeaderFooter() {
  const base = import.meta.env.BASE_URL;

  const [headerTemplate, footerTemplate] = await Promise.all([
    loadTemplate(`${base}partials/header.html`),
    loadTemplate(`${base}partials/footer.html`),
  ]);

  renderWithTemplate(headerTemplate, document.querySelector("#main-header"));
  renderWithTemplate(footerTemplate, document.querySelector("#main-footer"));

  // ✅ Arregla rutas del header/footer sin importar en qué página estés
  fixBaseUrls(document);
}
