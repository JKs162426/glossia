export function renderWithTemplate(template, parentElement) {
  parentElement.innerHTML = template;
}

async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`No se pudo cargar ${path} (${res.status})`);
  return res.text();
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

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
}
