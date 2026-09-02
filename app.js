const categories = [
  "Favorite", "2nd Favorite", "Least Favorite", "Underrated", "Overrated",
  "Best Starter", "Best Dynamax", "Best Mega", "Best Legendary", "Best Eeveelution",
  "Would have as a pet", "Best looking shiny", "Idk why I like this, but I do",
  "Has personal story", "Very nostalgic to me"
];

const GENERATIONS = [
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

// Classic Trainer Avatar Roster
const TRAINER_AVATARS = [
  { name: "Red", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png" },
  { name: "Blue", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/blue.png" },
  { name: "Leaf", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/leaf.png" },
  { name: "Ethan", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/ethan.png" },
  { name: "Lyra", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/lyra.png" },
  { name: "Silver", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/silver.png" },
  { name: "Brendan", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/brendan.png" },
  { name: "May", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/may.png" },
  { name: "Lucas", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/lucas.png" },
  { name: "Dawn", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/dawn.png" },
  { name: "Cynthia", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/cynthia.png" },
  { name: "Steven", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/steven.png" },
  { name: "Lance", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/lance.png" },
  { name: "Rocket Grunt", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/teamrocket.png" }
];

let allPokemon = [];
let activeGenIndex = 0;
let activeSlotIndex = null;
let deferredPrompt = null;
let gridState = JSON.parse(localStorage.getItem("pokemon_grid_data")) || {};

// DOM Elements
const gridEl = document.getElementById("pokemon-grid");
const pickerModal = document.getElementById("picker-modal");
const settingsModal = document.getElementById("settings-modal");
const confirmModal = document.getElementById("confirm-modal");
const avatarModal = document.getElementById("avatar-modal");
const searchInput = document.getElementById("search-input");
const shinyToggle = document.getElementById("shiny-toggle");
const pokemonListEl = document.getElementById("pokemon-list");
const genTabsEl = document.getElementById("gen-tabs");
const modalCategoryTitle = document.getElementById("modal-category-title");

// Trainer Inputs & Wrappers
const trainerInput = document.getElementById("trainer-name-input");
const nameWrapper = document.getElementById("name-wrapper");
const firstGameInput = document.getElementById("first-game-input");
const firstGameWrapper = document.getElementById("first-game-wrapper");
const favLocationInput = document.getElementById("fav-location-input");
const locationWrapper = document.getElementById("location-wrapper");

// Avatar Elements
const avatarBtn = document.getElementById("avatar-btn");
const trainerAvatarImg = document.getElementById("trainer-avatar-img");
const avatarGrid = document.getElementById("avatar-grid");
const avatarCloseBtn = document.getElementById("avatar-close-btn");

// Toolbar Buttons
const openSettingsBtn = document.getElementById("open-settings-btn");
const settingsCloseBtn = document.getElementById("settings-close-btn");
const modalCloseBtn = document.getElementById("modal-close-btn");
const downloadBtn = document.getElementById("download-btn");
const copyBtn = document.getElementById("copy-btn");
const openResetBtn = document.getElementById("open-reset-btn");
const cancelResetBtn = document.getElementById("cancel-reset-btn");
const confirmResetBtn = document.getElementById("confirm-reset-btn");
const pwaInstallBtn = document.getElementById("pwa-install-btn");

// 1. Auto-Expanding Dynamic Pills Setup
function bindDynamicInput(input, wrapper, storageKey) {
  const sync = () => {
    wrapper.dataset.value = input.value || input.placeholder;
  };
  const saved = localStorage.getItem(storageKey) || "";
  input.value = saved;
  sync();
  input.addEventListener("input", (e) => {
    sync();
    localStorage.setItem(storageKey, e.target.value);
  });
}

bindDynamicInput(trainerInput, nameWrapper, "pokemon_grid_trainer");
bindDynamicInput(firstGameInput, firstGameWrapper, "pokemon_grid_firstgame");
bindDynamicInput(favLocationInput, locationWrapper, "pokemon_grid_location");

// 2. Trainer Avatar Management
const savedAvatar = localStorage.getItem("pokemon_grid_avatar") || TRAINER_AVATARS[0].url;
trainerAvatarImg.src = savedAvatar;

function buildAvatarGrid() {
  avatarGrid.innerHTML = "";
  TRAINER_AVATARS.forEach((av) => {
    const card = document.createElement("div");
    card.className = "avatar-card";
    card.innerHTML = `
      <img src="${av.url}" crossOrigin="anonymous" alt="${av.name}" />
      <span>${av.name}</span>
    `;
    card.onclick = () => {
      trainerAvatarImg.src = av.url;
      localStorage.setItem("pokemon_grid_avatar", av.url);
      avatarModal.classList.add("hidden");
    };
    avatarGrid.appendChild(card);
  });
}

avatarBtn.addEventListener("click", () => {
  buildAvatarGrid();
  avatarModal.classList.remove("hidden");
});
avatarCloseBtn.addEventListener("click", () => avatarModal.classList.add("hidden"));

// 3. Render Pokémon Grid Cards
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

// 4. Fetch Pokémon List
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

// 5. Tab Navigation & List Filtering
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

  let list = allPokemon.filter(p => p.id >= currentGen.start && p.id <= currentGen.end);

  if (query) {
    list = allPokemon.filter(p => p.name.toLowerCase().includes(query) || String(p.id).includes(query));
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

// 6. Modal Selection
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

// 7. Export Image (Download)
downloadBtn.addEventListener("click", () => {
  const target = document.getElementById("grid-wrapper");
  html2canvas(target, { useCORS: true, backgroundColor: "#191e24", scale: 2 }).then((canvas) => {
    const link = document.createElement("a");
    const trainerName = trainerInput.value.trim().replace(/\s+/g, "-") || "trainer";
    link.download = `pokegrid-${trainerName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

// 8. Copy Image to Clipboard
copyBtn.addEventListener("click", async () => {
  const target = document.getElementById("grid-wrapper");
  const originalText = copyBtn.innerText;

  try {
    const canvas = await html2canvas(target, { useCORS: true, backgroundColor: "#191e24", scale: 2 });
    canvas.toBlob(async (blob) => {
      if (!blob) throw new Error("Blob conversion failed");
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]);
      copyBtn.innerText = "Copied!";
      copyBtn.style.background = "#2e7d32";
      setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.style.background = "";
      }, 2000);
    }, "image/png");
  } catch (err) {
    console.error("Copy failed:", err);
    alert("Could not copy directly to clipboard. Please use 'Export Image' instead.");
  }
});

// 9. Reset Modal Handlers
openResetBtn.addEventListener("click", () => {
  confirmModal.classList.remove("hidden");
});

cancelResetBtn.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
});

confirmResetBtn.addEventListener("click", () => {
  gridState = {};
  localStorage.removeItem("pokemon_grid_data");
  renderGrid();
  confirmModal.classList.add("hidden");
});

// 10. PWA Install Logic
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  pwaInstallBtn.innerText = "Install App";
});

pwaInstallBtn.addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      pwaInstallBtn.innerText = "App Installed!";
      pwaInstallBtn.disabled = true;
    }
    deferredPrompt = null;
  } else {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      alert("To install on iOS: tap the Share button in Safari, then select 'Add to Home Screen'.");
    } else {
      alert("To install: use your browser's menu (top-right or address bar icon) and select 'Install PokéGrid' or 'Add to Home screen'.");
    }
  }
});

window.addEventListener("appinstalled", () => {
  pwaInstallBtn.innerText = "App Installed!";
  pwaInstallBtn.disabled = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(console.error);
  });
}

// Initialization
buildGenTabs();
fetchPokemonList();
renderGrid();