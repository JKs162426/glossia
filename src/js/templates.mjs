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

  fixBaseUrls(document);
}
