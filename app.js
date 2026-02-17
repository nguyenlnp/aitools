// ── State ──
let filteredTools = [...AI_TOOLS];
let currentCategory = "all";
let currentSort = "rating";
let searchQuery = "";

// ── DOM refs ──
const grid = document.getElementById("tools-grid");
const noResults = document.getElementById("no-results");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const sortBy = document.getElementById("sort-by");
const totalToolsEl = document.getElementById("total-tools");
const totalCategoriesEl = document.getElementById("total-categories");
const modalOverlay = document.getElementById("modal-overlay");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

// ── Helpers ──
function starsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.3;
  let s = "";
  for (let i = 0; i < full; i++) s += "\u2605";
  if (half) s += "\u00BD";
  return s;
}

function categoryLabel(cat) {
  const labels = {
    "coding-assistant": "Coding Assistant",
    "cli-tool": "CLI Tool",
    "agent-framework": "Agent Framework",
    "ai-platform": "AI Platform",
    "github-project": "GitHub Project",
    skill: "Skill",
  };
  return labels[cat] || cat;
}

// ── Render ──
function renderCards() {
  grid.innerHTML = "";
  if (filteredTools.length === 0) {
    noResults.hidden = false;
    return;
  }
  noResults.hidden = true;

  filteredTools.forEach((tool) => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.innerHTML = `
      <div class="card-header">
        <h3>${tool.name}</h3>
        <span class="card-badge badge-${tool.category}">${categoryLabel(tool.category)}</span>
      </div>
      <p class="card-desc">${tool.tagline}</p>
      <div class="card-meta">
        <div class="rating">
          <span class="stars">${starsHTML(tool.rating)}</span>
          ${tool.rating.toFixed(1)}
        </div>
        ${tool.trending ? '<span class="trending-badge">Trending</span>' : ""}
      </div>
    `;
    card.addEventListener("click", () => openModal(tool));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openModal(tool);
    });
    grid.appendChild(card);
  });
}

// ── Modal ──
function openModal(tool) {
  modalContent.innerHTML = `
    <h2>${tool.name}</h2>
    <div class="modal-category">${categoryLabel(tool.category)}</div>
    <div class="modal-rating">
      <span class="score">${tool.rating.toFixed(1)}</span>
      <span class="out-of">/ 5.0</span>
      <span class="stars">${starsHTML(tool.rating)}</span>
    </div>

    <div class="modal-section">
      <h4>Overview</h4>
      <p>${tool.description}</p>
    </div>

    <div class="modal-section">
      <h4>Why It's Good</h4>
      <ul>${tool.whyGood.map((r) => `<li>${r}</li>`).join("")}</ul>
    </div>

    <div class="modal-section">
      <h4>Typical Use Cases</h4>
      <ul>${tool.useCases.map((u) => `<li>${u}</li>`).join("")}</ul>
    </div>

    <div class="modal-section">
      <h4>Details</h4>
      <p><strong>GitHub Stars:</strong> ${tool.stars} &nbsp;|&nbsp; <strong>Pricing:</strong> ${tool.pricing} &nbsp;|&nbsp; <strong>Updated:</strong> ${tool.lastUpdated}</p>
    </div>

    <div class="modal-tags">
      ${tool.tags.map((t) => `<span class="modal-tag">${t}</span>`).join("")}
    </div>

    <a class="modal-link" href="${tool.url}" target="_blank" rel="noopener">Visit Project &rarr;</a>
  `;
  modalOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.hidden = true;
  document.body.style.overflow = "";
}

// ── Filter & Sort ──
function applyFilters() {
  filteredTools = AI_TOOLS.filter((tool) => {
    const matchesCategory =
      currentCategory === "all" || tool.category === currentCategory;
    const matchesSearch =
      searchQuery === "" ||
      tool.name.toLowerCase().includes(searchQuery) ||
      tool.tagline.toLowerCase().includes(searchQuery) ||
      tool.description.toLowerCase().includes(searchQuery) ||
      tool.tags.some((t) => t.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  filteredTools.sort((a, b) => {
    switch (currentSort) {
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      case "trending":
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.rating - a.rating;
      case "newest":
        return a.lastUpdated < b.lastUpdated ? 1 : -1;
      default:
        return 0;
    }
  });

  renderCards();
}

// ── Stats ──
function updateStats() {
  totalToolsEl.textContent = AI_TOOLS.length;
  const cats = new Set(AI_TOOLS.map((t) => t.category));
  totalCategoriesEl.textContent = cats.size;
}

// ── Event listeners ──
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase().trim();
  applyFilters();
});

categoryFilter.addEventListener("change", (e) => {
  currentCategory = e.target.value;
  applyFilters();
});

sortBy.addEventListener("change", (e) => {
  currentSort = e.target.value;
  applyFilters();
});

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ── Init ──
updateStats();
applyFilters();
