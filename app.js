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

// Reliable Smogon GitHub Raw CDN (CORS & hotlink friendly)
const TRAINER_BASE = "https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/mods/gen5/sprites/trainers/";

// Comprehensive list: Classic Route NPCs + Protagonists + Rivals + Champions
const TRAINER_AVATARS = [
  // Route Trainers & Common NPCs
  { name: "Youngster", file: "youngster.png" },
  { name: "Lass", file: "lass.png" },
  { name: "Bug Catcher", file: "bugcatcher.png" },
  { name: "Hiker", file: "hiker.png" },
  { name: "Fisherman", file: "fisherman.png" },
  { name: "Ace Trainer (M)", file: "acetrainer.png" },
  { name: "Ace Trainer (F)", file: "acetrainerf.png" },
  { name: "Hex Maniac", file: "hexmaniac.png" },
  { name: "Black Belt", file: "blackbelt.png" },
  { name: "Swimmer (M)", file: "swimmer.png" },
  { name: "Swimmer (F)", file: "swimmerf.png" },
  { name: "Psychic", file: "psychic.png" },
  { name: "Scientist", file: "scientist.png" },
  { name: "Sailor", file: "sailor.png" },
  { name: "Bird Keeper", file: "birdkeeper.png" },
  { name: "Camper", file: "camper.png" },
  { name: "Picnicker", file: "picnicker.png" },
  { name: "Pokemaniac", file: "pokemaniac.png" },
  { name: "Super Nerd", file: "supernerd.png" },
  { name: "Beauty", file: "beauty.png" },
  { name: "Gentleman", file: "gentleman.png" },
  { name: "Biker", file: "biker.png" },
  { name: "Cue Ball", file: "cueball.png" },
  { name: "Burglar", file: "burglar.png" },
  { name: "Juggler", file: "juggler.png" },
  { name: "Guitarist", file: "guitarist.png" },
  { name: "Battle Girl", file: "battlegirl.png" },
  { name: "Dragon Tamer", file: "dragontamer.png" },
  { name: "Rocket Grunt", file: "teamrocket.png" },

  // Protagonists & Rivals
  { name: "Red", file: "red.png" },
  { name: "Blue", file: "blue.png" },
  { name: "Leaf", file: "leaf.png" },
  { name: "Ethan", file: "ethan.png" },
  { name: "Lyra", file: "lyra.png" },
  { name: "Silver", file: "silver.png" },
  { name: "Brendan", file: "brendan.png" },
  { name: "May", file: "may.png" },
  { name: "Wally", file: "wally.png" },
  { name: "Lucas", file: "lucas.png" },
  { name: "Dawn", file: "dawn.png" },
  { name: "Barry", file: "barry.png" },
  { name: "Hilbert", file: "hilbert.png" },
  { name: "Hilda", file: "hilda.png" },
  { name: "N", file: "n.png" },
  { name: "Cynthia", file: "cynthia.png" },
  { name: "Steven", file: "steven.png" },
  { name: "Lance", file: "lance.png" }
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
const confirmModal = document.getElementById("confirm-modal");
const avatarModal = document.getElementById("avatar-modal");
const searchInput = document.getElementById("search-input");
const shinyToggle = document.getElementById("shiny-toggle");
const pokemonListEl = document.getElementById("pokemon-list");
const genTabsEl = document.getElementById("gen-tabs");
const modalCategoryTitle = document.getElementById("modal-category-title");

// Dossier Inputs
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

// 1. Dynamic Auto-Expanding Inputs
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

// 2. Avatar Selection
const savedAvatar = localStorage.getItem("pokemon_grid_avatar");
if (savedAvatar && savedAvatar.includes("raw.githubusercontent.com")) {
  trainerAvatarImg.src = savedAvatar;
} else {
  trainerAvatarImg.src = TRAINER_BASE + TRAINER_AVATARS[0].file;
}

function buildAvatarGrid() {
  avatarGrid.innerHTML = "";
  TRAINER_AVATARS.forEach((av) => {
    const fullUrl = TRAINER_BASE + av.file;
    const card = document.createElement("div");
    card.className = "avatar-card";
    card.innerHTML = `
      <img src="${fullUrl}" crossOrigin="anonymous" alt="${av.name}" loading="lazy" />
      <span>${av.name}</span>
    `;
    card.onclick = () => {
      trainerAvatarImg.src = fullUrl;
      localStorage.setItem("pokemon_grid_avatar", fullUrl);
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

// 3. Render Pokémon Cards
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

// 4. PokéAPI List
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

// 5. Gen Tabs & Pokémon Filtering
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

// 6. Picker Modal
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

// 7. Image Export
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

// 8. Clipboard Copy
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

// 9. Reset Modal
openResetBtn.addEventListener("click", () => confirmModal.classList.remove("hidden"));
cancelResetBtn.addEventListener("click", () => confirmModal.classList.add("hidden"));
confirmResetBtn.addEventListener("click", () => {
  gridState = {};
  localStorage.removeItem("pokemon_grid_data");
  renderGrid();
  confirmModal.classList.add("hidden");
});

// 10. PWA Installation
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