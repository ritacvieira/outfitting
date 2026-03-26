function renderModalLinks(linkItems) {
  if (!linkItems.length) {
    modalLinks.innerHTML = `<p class="modal-description">No affiliate links added yet.</p>`;
    return;
  }

  modalLinks.innerHTML = linkItems
    .map(link => {
      const label = escapeHtml(link.label || "Open link");
      const url = escapeAttribute(link.url || "#");
      const image = escapeAttribute(link.image || "");

      const thumbnailHtml = image
        ? `<img class="affiliate-thumb" src="${image}" alt="${label}" />`
        : `<div class="affiliate-thumb affiliate-thumb-placeholder"></div>`;

      return `
        <a class="affiliate-link" href="${url}" target="_blank" rel="noopener noreferrer">
          <div class="affiliate-link-left">
            ${thumbnailHtml}
            <span class="affiliate-link-label">${label}</span>
          </div>
          <span class="affiliate-link-arrow">↗</span>
        </a>
      `;
    })
    .join("");
}
