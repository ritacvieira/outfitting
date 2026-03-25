const postsGrid = document.getElementById("posts-grid");
const modal = document.getElementById("post-modal");
const modalBackdrop = document.getElementById("modal-backdrop");
const closeModalBtn = document.getElementById("close-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalTags = document.getElementById("modal-tags");
const modalLinks = document.getElementById("modal-links");
const prevImageBtn = document.getElementById("prev-image");
const nextImageBtn = document.getElementById("next-image");

let allPosts = [];
let currentPost = null;
let currentImageIndex = 0;

async function loadPosts() {
  try {
    const response = await fetch("posts.json");
    const posts = await response.json();

    allPosts = posts;
    renderPosts(posts);
  } catch (error) {
    console.error("Error loading posts:", error);
    postsGrid.innerHTML = `
      <div class="empty-state">
        <p>Could not load posts. Check that your posts.json file exists and is valid.</p>
      </div>
    `;
  }
}

function renderPosts(posts) {
  if (!posts.length) {
    postsGrid.innerHTML = `
      <div class="empty-state">
        <p>No posts yet. Add your first post in posts.json.</p>
      </div>
    `;
    return;
  }

  postsGrid.innerHTML = posts
    .map((post, index) => {
      const firstImage = post.images?.[0] || "";
      const tagsHtml = (post.tags || [])
        .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join("");

      return `
        <article class="post-card" data-index="${index}">
          <div class="post-card-image">
            <img src="${firstImage}" alt="${escapeHtml(post.title)}" />
          </div>
          <div class="post-card-content">
            <h2 class="post-card-title">${escapeHtml(post.title)}</h2>
            <div class="tags">${tagsHtml}</div>
          </div>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll(".post-card").forEach(card => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.index);
      openModal(allPosts[index]);
    });
  });
}

function openModal(post) {
  currentPost = post;
  currentImageIndex = 0;

  modalTitle.textContent = post.title || "";
  modalDescription.textContent = post.description || "";

  renderModalImage();
  renderModalTags(post.tags || []);
  renderModalLinks(post.links || []);

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
  currentPost = null;
  currentImageIndex = 0;
}

function renderModalImage() {
  if (!currentPost || !currentPost.images || currentPost.images.length === 0) {
    modalImage.src = "";
    modalImage.alt = "";
    prevImageBtn.style.display = "none";
    nextImageBtn.style.display = "none";
    return;
  }

  modalImage.src = currentPost.images[currentImageIndex];
  modalImage.alt = currentPost.title || "Post image";

  const multipleImages = currentPost.images.length > 1;
  prevImageBtn.style.display = multipleImages ? "block" : "none";
  nextImageBtn.style.display = multipleImages ? "block" : "none";
}

function renderModalTags(tags) {
  modalTags.innerHTML = tags
    .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");
}

function renderModalLinks(linkItems) {
  if (!linkItems.length) {
    modalLinks.innerHTML = `<p class="modal-description">No affiliate links added yet.</p>`;
    return;
  }

  modalLinks.innerHTML = linkItems
    .map(link => {
      const label = escapeHtml(link.label || "Open link");
      const url = escapeAttribute(link.url || "#");

      return `
        <a class="affiliate-link" href="${url}" target="_blank" rel="noopener noreferrer">
          <span class="affiliate-link-label">${label}</span>
          <span class="affiliate-link-arrow">↗</span>
        </a>
      `;
    })
    .join("");
}

function showPreviousImage() {
  if (!currentPost || !currentPost.images || currentPost.images.length <= 1) return;
  currentImageIndex = (currentImageIndex - 1 + currentPost.images.length) % currentPost.images.length;
  renderModalImage();
}

function showNextImage() {
  if (!currentPost || !currentPost.images || currentPost.images.length <= 1) return;
  currentImageIndex = (currentImageIndex + 1) % currentPost.images.length;
  renderModalImage();
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(text) {
  return String(text).replaceAll('"', "&quot;");
}

closeModalBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);
prevImageBtn.addEventListener("click", showPreviousImage);
nextImageBtn.addEventListener("click", showNextImage);

document.addEventListener("keydown", event => {
  if (modal.classList.contains("hidden")) return;

  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowLeft") showPreviousImage();
  if (event.key === "ArrowRight") showNextImage();
});

loadPosts();
