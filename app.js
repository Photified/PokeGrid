const categories = [
  "Favorite", "2nd Favorite", "Least Favorite", "Underrated", "Overrated",
  "Best Starter", "Best Dynamax", "Best Mega", "Best Region Variant", "Best Eeveelution",
  "Would have as a pet", "Best looking shiny", "Idk why I like this, but I do",
  "Has a personal story behind it", "Very nostalgic to me"
];

// Generation dex limits (All 1,025 Pokémon)
const GENERATIONS = [
  { gen: "All", start: 1, end: 1025 },
  { gen: "Gen I", start: 1, end: 151 },
  { gen: "Gen II", start: 152, end: 251 },
  { gen: "Gen III", start: 252, end: 386 },
  { gen: "Gen IV", start: 387, end: 493 },
  { gen: "Gen V", start: 494, end: 649 },
  { gen: "Gen VI", start: 650, end: 721 },
  { gen: "Gen VII", start: 722, end: 809 },
  { gen: "Gen VIII", start: 810, end: 905 },
  { gen: "Gen IX", start: 906, end: 1025 }
];

let allPokemon = [];
let activeGenIndex = 0;
let activeSlotIndex = null;
let deferredPrompt = null;
let gridState = JSON.parse(localStorage.getItem("pokemon_grid_data")) || {};

// Elements
const gridEl = document.getElementById("pokemon-grid");
const pickerModal = document.getElementById("picker-modal");
const settingsModal = document.getElementById("settings-modal");
const searchInput = document.getElementById("search-input");
const shinyToggle = document.getElementById("shiny-toggle");
const pokemonListEl = document.getElementById("pokemon-list");
const genTabsEl = document.getElementById("gen-tabs");
const modalCategoryTitle = document.getElementById("modal-category-title");
const openSettingsBtn = document.getElementById("open-settings-btn");
const settingsCloseBtn = document.getElementById("settings-close-btn");
const modalCloseBtn = document.getElementById("modal-close-btn");
const downloadBtn = document.getElementById("download-btn");
const resetBtn = document.getElementById("reset-btn");
const installWrapper = document.getElementById("install-wrapper");
const pwaInstallBtn = document.getElementById("pwa-install-btn");

// 1. Render Grid
function renderGrid() {
  gridEl.innerHTML = "";
  categories.forEach((category, idx) => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => openPicker(idx);

    const spriteContainer = document.createElement("div");
    spriteContainer.className = "card-sprite";

    if (gridState[idx]) {
      const img = document.createElement("img");
      img.src = gridState[idx].sprite;
      img.crossOrigin = "anonymous";
      spriteContainer.appendChild(img);
    }

    const label = document.createElement("div");
    label.className = "card-label";
    label.innerText = category;

    card.appendChild(spriteContainer);
    card.appendChild(label);
    gridEl.appendChild(card);
  });
}

// 2. Fetch all 1,025 Pokémon entries
async function fetchPokemonList() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
    const data = await res.json();
    allPokemon = data.results.map((p, idx) => ({ id: idx + 1, name: p.name }));
    renderFilteredList();
  } catch (err) {
    console.error("Failed to load Pokémon list:", err);
  }
}

// 3. Tab Navigation & Filtering
function buildGenTabs() {
  genTabsEl.innerHTML = "";
  GENERATIONS.forEach((g, idx) => {
    const btn = document.createElement("button");
    btn.className = `gen-tab-btn ${idx === activeGenIndex ? "active" : ""}`;
    btn.innerText = g.gen;
    btn.onclick = () => {
      activeGenIndex = idx;
      document.querySelectorAll(".gen-tab-btn").forEach((b, i) => {
        b.classList.toggle("active", i === idx);
      });
      renderFilteredList();
    };
    genTabsEl.appendChild(btn);
  });
}

function renderFilteredList() {
  const query = searchInput.value.toLowerCase().trim();
  const currentGen = GENERATIONS[activeGenIndex];

  // Filter within Gen bounds first (maintaining dex order)
  let list = allPokemon.filter(p => p.id >= currentGen.start && p.id <= currentGen.end);

  if (query) {
    list = list.filter(p => p.name.toLowerCase().includes(query) || String(p.id).includes(query));
  }

  pokemonListEl.innerHTML = "";
  list.forEach((p) => {
    const item = document.createElement("div");
    item.className = "pokemon-option";
    item.innerHTML = `<span class="dex-id">#${p.id}</span> <span>${p.name}</span>`;
    item.onclick = () => selectPokemon(p.id);
    pokemonListEl.appendChild(item);
  });
}

// 4. Modal Triggers
function openPicker(slotIdx) {
  activeSlotIndex = slotIdx;
  modalCategoryTitle.innerText = categories[slotIdx];
  shinyToggle.checked = slotIdx === 11;
  searchInput.value = "";
  renderFilteredList();
  pickerModal.classList.remove("hidden");
  searchInput.focus();
}

function selectPokemon(id) {
  const isShiny = shinyToggle.checked;
  const spriteUrl = isShiny
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  gridState[activeSlotIndex] = { id, sprite: spriteUrl };
  localStorage.setItem("pokemon_grid_data", JSON.stringify(gridState));
  renderGrid();
  pickerModal.classList.add("hidden");
}

searchInput.addEventListener("input", renderFilteredList);
modalCloseBtn.addEventListener("click", () => pickerModal.classList.add("hidden"));
openSettingsBtn.addEventListener("click", () => settingsModal.classList.remove("hidden"));
settingsCloseBtn.addEventListener("click", () => settingsModal.classList.add("hidden"));

// 5. Image Export
downloadBtn.addEventListener("click", () => {
  const target = document.getElementById("grid-wrapper");
  html2canvas(target, { useCORS: true, backgroundColor: "#191e24", scale: 2 }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "about-me-pokemon.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

// 6. Reset
resetBtn.addEventListener("click", () => {
  if (confirm("Reset all selections?")) {
    gridState = {};
    localStorage.removeItem("pokemon_grid_data");
    renderGrid();
  }
});

// 7. PWA Installation Handler
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installWrapper.classList.remove("hidden");
});

pwaInstallBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === "accepted") {
    installWrapper.classList.add("hidden");
  }
  deferredPrompt = null;
});

window.addEventListener("appinstalled", () => {
  installWrapper.classList.add("hidden");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(console.error);
  });
}

// Initialize
buildGenTabs();
fetchPokemonList();
renderGrid();