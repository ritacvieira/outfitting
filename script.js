const postsGrid = document.getElementById("posts-grid");

const modal = document.getElementById("post-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalTags = document.getElementById("modal-tags");
const modalLinks = document.getElementById("modal-links");

const closeModalBtn = document.getElementById("close-modal");
const backdrop = document.getElementById("modal-backdrop");

let currentImages = [];
let currentIndex = 0;

async function loadPosts() {
  try {
    const res = await fetch("posts.json");
    const posts = await res.json();

    renderPosts(posts);
  } catch (err) {
    postsGrid.innerHTML = `<p class="empty-state">Could not load posts.</p>`;
    console.error(err);
  }
}

function renderPosts(posts) {
  postsGrid.innerHTML = posts
    .map((post, index) => {
      const image = post.images?.[0] || "";

      return `
        <div class="post-card" onclick="openPost(${index})">
          <div class="post-card-image">
            <img src="${image}" />
          </div>
          <div class="post-card-content">
            <h3 class="post-card-title">${post.title}</h3>
            <div class="tags">
              ${(post.tags || [])
                .map(tag => `<span class="tag">${tag}</span>`)
                .join("")}
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  window.postsData = posts;
}

function openPost(index) {
  const post = window.postsData[index];

  currentImages = post.images || [];
  currentIndex = 0;

  modalImage.src = currentImages[0] || "";
  modalTitle.textContent = post.title;
  modalDescription.textContent = post.description;

  modalTags.innerHTML = (post.tags || [])
    .map(tag => `<span class="tag">${tag}</span>`)
    .join("");

  renderModalLinks(post.links || []);

  modal.classList.remove("hidden");
}

function renderModalLinks(linkItems) {
  if (!linkItems.length) {
    modalLinks.innerHTML = `<p>No links yet</p>`;
    return;
  }

  modalLinks.innerHTML = linkItems
    .map(link => {
      const image = link.image || "";

      return `
        <a class="affiliate-link" href="${link.url}" target="_blank">
          <div class="affiliate-link-left">
            ${
              image
                ? `<img class="affiliate-thumb" src="${image}" />`
                : `<div class="affiliate-thumb"></div>`
            }
            <span>${link.label}</span>
          </div>
          <span>↗</span>
        </a>
      `;
    })
    .join("");
}

function closeModal() {
  modal.classList.add("hidden");
}

closeModalBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);

document.getElementById("prev-image").onclick = () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  modalImage.src = currentImages[currentIndex];
};

document.getElementById("next-image").onclick = () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  modalImage.src = currentImages[currentIndex];
};

loadPosts();
