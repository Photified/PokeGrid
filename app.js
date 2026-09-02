const categories = [
  "Favorite", "2nd Favorite", "Least Favorite", "Underrated", "Overrated",
  "Best Starter", "Coolest Design", "Best Mythical", "Best Legendary", "Best Eeveelution",
  "Would have as a pet", "Best looking shiny", "Idk why I like this, but I do",
  "Has personal story", "Very nostalgic to me"
];

// 9 Standard Generations
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

// --- Curated Restricted Pools (National Dex IDs) ---

// All Starters & their full evolution lines (plus Partner Pikachu/Eevee)
const STARTER_IDS = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 26, 133, // Gen 1 (Bulbasaur, Charmander, Squirtle lines + Pikachu/Eevee)
  152, 153, 154, 155, 156, 157, 158, 159, 160, // Gen 2 (Chikorita, Cyndaquil, Totodile lines)
  252, 253, 254, 255, 256, 257, 258, 259, 260, // Gen 3 (Treecko, Torchic, Mudkip lines)
  387, 388, 389, 390, 391, 392, 393, 394, 395, // Gen 4 (Turtwig, Chimchar, Piplup lines)
  495, 496, 497, 498, 499, 500, 501, 502, 503, // Gen 5 (Snivy, Tepig, Oshawott lines)
  650, 651, 652, 653, 654, 655, 656, 657, 658, // Gen 6 (Chespin, Fennekin, Froakie lines)
  722, 723, 724, 725, 726, 727, 728, 729, 730, // Gen 7 (Rowlet, Litten, Popplio lines)
  810, 811, 812, 813, 814, 815, 816, 817, 818, // Gen 8 (Grookey, Scorbunny, Sobble lines)
  906, 907, 908, 909, 910, 911, 912, 913, 914  // Gen 9 (Sprigatito, Fuecoco, Quaxly lines)
]);

// Official Mythical Pokémon only
const MYTHICAL_IDS = new Set([
  151, // Mew
  251, // Celebi
  385, 386, // Jirachi, Deoxys
  489, 490, 491, 492, 493, // Phione, Manaphy, Darkrai, Shaymin, Arceus
  494, 647, 648, 649, // Victini, Keldeo, Meloetta, Genesect
  719, 720, 721, // Diancie, Hoopa, Volcanion
  801, 807, 808, 809, // Magearna, Marshadow, Zeraora, Meltan, Melmetal
  893, // Zarude
  1025 // Pecharunt
]);

// Official Legendary Pokémon (Major Box Legends, Minor Trios/Quartets, Sub-Legends, Ultra Beasts, Paradox Legends)
const LEGENDARY_IDS = new Set([
  144, 145, 146, 150, // Birds, Mewtwo
  243, 244, 245, 249, 250, // Beasts, Lugia, Ho-Oh
  377, 378, 379, 380, 381, 382, 383, 384, // Regi trio, Lati@s, Weather trio
  480, 481, 482, 483, 484, 485, 486, 487, 488, // Lake trio, Creation trio, Heatran, Regigigas, Cresselia
  638, 639, 640, 641, 642, 643, 644, 645, 646, // Swords of Justice, Forces of Nature, Tao trio
  716, 717, 718, // Aura trio (Xerneas, Yveltal, Zygarde)
  772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 803, 804, 805, 806, // Type: Null, Silvally, Tapus, Cosmog line, Light trio, Ultra Beasts
  888, 889, 890, 891, 892, 894, 895, 896, 897, 898, 905, // Hero duo, Eternatus, Kubfu, Urshifu, Regieleki, Regidrago, Calyrex steeds, Enamorus
  1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017, 1024 // Treasures of Ruin, Koraidon, Miraidon, Loyal Three, Ogerpon, Terapagos
]);

// Eevee and all 8 Evolutions
const EEVEELUTION_IDS = new Set([
  133, 134, 135, 136, 196, 197, 470, 471, 700 // Eevee, Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Leafeon, Glaceon, Sylveon
]);

// PokéAPI Verified Ball Item Endpoints
const POKEBALLS = [
  { name: "Poké Ball", slug: "poke-ball" },
  { name: "Great Ball", slug: "great-ball" },
  { name: "Ultra Ball", slug: "ultra-ball" },
  { name: "Master Ball", slug: "master-ball" },
  { name: "Safari Ball", slug: "safari-ball" },
  { name: "Fast Ball", slug: "fast-ball" },
  { name: "Level Ball", slug: "level-ball" },
  { name: "Lure Ball", slug: "lure-ball" },
  { name: "Heavy Ball", slug: "heavy-ball" },
  { name: "Love Ball", slug: "love-ball" },
  { name: "Friend Ball", slug: "friend-ball" },
  { name: "Moon Ball", slug: "moon-ball" },
  { name: "Sport Ball", slug: "sport-ball" },
  { name: "Net Ball", slug: "net-ball" },
  { name: "Dive Ball", slug: "dive-ball" },
  { name: "Nest Ball", slug: "nest-ball" },
  { name: "Repeat Ball", slug: "repeat-ball" },
  { name: "Timer Ball", slug: "timer-ball" },
  { name: "Luxury Ball", slug: "luxury-ball" },
  { name: "Premier Ball", slug: "premier-ball" },
  { name: "Dusk Ball", slug: "dusk-ball" },
  { name: "Heal Ball", slug: "heal-ball" },
  { name: "Quick Ball", slug: "quick-ball" },
  { name: "Cherish Ball", slug: "cherish-ball" },
  { name: "Park Ball", slug: "park-ball" },
  { name: "Dream Ball", slug: "dream-ball" },
  { name: "Beast Ball", slug: "beast-ball" }
];

const POKEMON_GAMES = [
  "Red", "Blue", "Yellow",
  "Gold", "Silver", "Crystal",
  "Ruby", "Sapphire", "Emerald", "FireRed", "LeafGreen", "Colosseum", "XD: Gale of Darkness",
  "Diamond", "Pearl", "Platinum", "HeartGold", "SoulSilver",
  "Black", "White", "Black 2", "White 2",
  "X", "Y", "Omega Ruby", "Alpha Sapphire",
  "Sun", "Moon", "Ultra Sun", "Ultra Moon", "Let's Go Pikachu/Eevee",
  "Sword", "Shield", "Brilliant Diamond", "Shining Pearl", "Legends: Arceus",
  "Scarlet", "Violet"
];

const REGION_LOCATIONS = {
  "Gen I": [
    "Pallet Town", "Viridian City", "Pewter City", "Cerulean City", "Vermilion City", "Lavender Town", "Celadon City", "Fuchsia City", "Saffron City", "Cinnabar Island", "Indigo Plateau",
    "Route 1", "Route 24 (Nugget Bridge)", "Viridian Forest", "Mt. Moon", "Rock Tunnel", "Pokémon Tower", "Safari Zone", "Silph Co.", "Seafoam Islands", "Power Plant", "Victory Road", "Cerulean Cave"
  ],
  "Gen II": [
    "New Bark Town", "Cherrygrove City", "Violet City", "Azalea Town", "Goldenrod City", "Ecruteak City", "Olivine City", "Cianwood City", "Mahogany Town", "Blackthorn City",
    "Sprout Tower", "Ruins of Alph", "Ilex Forest", "National Park", "Burned Tower", "Bell Tower", "Whirl Islands", "Mt. Mortar", "Lake of Rage", "Dragon's Den", "Mt. Silver"
  ],
  "Gen III": [
    "Littleroot Town", "Oldale Town", "Petalburg City", "Rustboro City", "Dewford Town", "Slateport City", "Mauville City", "Verdanturf Town", "Fallarbor Town", "Lavaridge Town", "Fortree City", "Lilycove City", "Mossdeep City", "Sootopolis City", "Pacifidlog Town", "Ever Grande City",
    "Route 113 (Ash Route)", "Route 119", "Route 120", "Petalburg Woods", "Granite Cave", "Fiery Path", "Meteor Falls", "Mt. Chimney", "Safari Zone", "Mt. Pyre", "Shoal Cave", "Seafloor Cavern", "Sky Pillar", "Battle Frontier"
  ],
  "Gen IV": [
    "Twinleaf Town", "Sandgem Town", "Jubilife City", "Oreburgh City", "Floaroma Town", "Eterna City", "Hearthome City", "Solaceon Town", "Veilstone City", "Pastoria City", "Celestic Town", "Canalave City", "Snowpoint City", "Sunyshore City",
    "Route 209", "Route 216 (Blizzard)", "Eterna Forest", "Mt. Coronet", "Great Marsh", "Lake Verity", "Lake Valor", "Lake Acuity", "Spear Pillar", "Distortion World", "Sendoff Spring", "Iron Island"
  ],
  "Gen V": [
    "Nuvema Town", "Accumula Town", "Striaton City", "Nacrene City", "Castelia City", "Nimbasa City", "Driftveil City", "Mistralton City", "Icirrus City", "Opelucid City", "Aspertia City", "Virbank City", "Undella Town", "Lacunosa Town",
    "Skyarrow Bridge", "Pinwheel Forest", "Desert Resort", "Relic Castle", "Chargestone Cave", "Dragonspiral Tower", "Village Bridge", "Giant Chasm", "PWT (World Tournament)", "N's Castle"
  ],
  "Gen VI": [
    "Vaniville Town", "Aquacorde Town", "Santalune City", "Lumiose City", "Camphrier Town", "Ambrette Town", "Cyllage City", "Geosenge Town", "Shalour City", "Coumarine City", "Laverre City", "Dendemille Town", "Anistar City", "Couriway Town", "Snowbelle City",
    "Santalune Forest", "Glittering Cave", "Tower of Mastery", "Kalos Power Plant", "Poké Ball Factory", "Frost Cavern", "Terminus Cave", "Pokémon Village"
  ],
  "Gen VII": [
    "Hau'oli City", "Iki Town", "Heahea City", "Paniola Town", "Konikoni City", "Malie City", "Tapu Village", "Po Town", "Seafolk Village",
    "Route 1", "Melemele Meadow", "Brooklet Hill", "Wela Volcano Park", "Lush Jungle", "Mount Hokulani", "Aether Paradise", "Exeggutor Island", "Vast Poni Canyon", "Mount Lanakila", "Ultra Space"
  ],
  "Gen VIII": [
    "Postwick", "Wedgehurst", "Motostoke", "Turffield", "Hulbury", "Hammerlocke", "Stow-on-Side", "Ballonlea", "Circhester", "Spikemuth", "Wyndon", "Master Dojo", "Freezington",
    "Wild Area (Lake of Outrage)", "Galar Mine", "Glimwood Tangle", "Slumbering Weald", "Isle of Armor", "Crown Tundra", "Dyna Tree Hill"
  ],
  "Gen IX": [
    "Cabo Poco", "Mesagoza", "Cortondo", "Artazon", "Levincia", "Zapapico", "Cascarrafa", "Porto Marinada", "Medali", "Montenevera", "Alfornada", "Glaseado Mountain", "Mossui Town", "Blueberry Academy",
    "Poco Path", "Area Zero (Great Crater)", "Asado Desert", "Tagtree Thicket", "Casseroya Lake", "Kitakami Wilds", "Terarium"
  ]
};

let allPokemon = [];
let activeGenIndex = 0;
let activeLocGenKey = "Gen I";
let activeSlotIndex = null;
let deferredPrompt = null;

let gridState = JSON.parse(localStorage.getItem("pokemon_grid_data")) || {};

// DOM Elements
const gridEl = document.getElementById("pokemon-grid");
const pickerModal = document.getElementById("picker-modal");
const gameModal = document.getElementById("game-modal");
const locationModal = document.getElementById("location-modal");
const ballModal = document.getElementById("ball-modal");
const settingsModal = document.getElementById("settings-modal");
const confirmModal = document.getElementById("confirm-modal");

const searchInput = document.getElementById("search-input");
const shinyToggle = document.getElementById("shiny-toggle");
const pokemonListEl = document.getElementById("pokemon-list");
const genTabsEl = document.getElementById("gen-tabs");
const modalCategoryTitle = document.getElementById("modal-category-title");
const modalCategoryFilterNote = document.getElementById("modal-category-filter-note");

// Trainer Inputs & Displays
const trainerInput = document.getElementById("trainer-name-input");
const nameWrapper = document.getElementById("name-wrapper");
const firstGamePill = document.getElementById("first-game-pill");
const firstGameDisplay = document.getElementById("first-game-display");
const locationPill = document.getElementById("location-pill");
const locationDisplay = document.getElementById("location-display");
const gameListEl = document.getElementById("game-list");
const locGenTabsEl = document.getElementById("loc-gen-tabs");
const locSearchInput = document.getElementById("loc-search-input");
const locationListEl = document.getElementById("location-list");

// Ball Elements
const ballBtn = document.getElementById("ball-btn");
const trainerBallImg = document.getElementById("trainer-ball-img");
const ballGrid = document.getElementById("ball-grid");

// Toolbar Buttons
const downloadBtn = document.getElementById("download-btn");
const copyBtn = document.getElementById("copy-btn");
const openResetBtn = document.getElementById("open-reset-btn");
const cancelResetBtn = document.getElementById("cancel-reset-btn");
const confirmResetBtn = document.getElementById("confirm-reset-btn");
const openSettingsBtn = document.getElementById("open-settings-btn");
const settingsCloseBtn = document.getElementById("settings-close-btn");
const modalCloseBtn = document.getElementById("modal-close-btn");
const gameCloseBtn = document.getElementById("game-close-btn");
const locationCloseBtn = document.getElementById("location-close-btn");
const ballCloseBtn = document.getElementById("ball-close-btn");
const pwaInstallBtn = document.getElementById("pwa-install-btn");

// 1. Trainer Name Setup
const savedName = localStorage.getItem("pokemon_grid_trainer") || "";
trainerInput.value = savedName;
nameWrapper.dataset.value = savedName || trainerInput.placeholder;
trainerInput.addEventListener("input", (e) => {
  nameWrapper.dataset.value = e.target.value || trainerInput.placeholder;
  localStorage.setItem("pokemon_grid_trainer", e.target.value);
});

// 2. First Game Selection
const savedGame = localStorage.getItem("pokemon_grid_firstgame");
if (savedGame) {
  firstGameDisplay.innerText = savedGame;
  firstGameDisplay.classList.remove("placeholder");
}

function buildGameList() {
  gameListEl.innerHTML = "";
  POKEMON_GAMES.forEach((game) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerText = game;
    item.onclick = () => {
      firstGameDisplay.innerText = game;
      firstGameDisplay.classList.remove("placeholder");
      localStorage.setItem("pokemon_grid_firstgame", game);
      gameModal.classList.add("hidden");
    };
    gameListEl.appendChild(item);
  });
}

firstGamePill.onclick = () => {
  buildGameList();
  gameModal.classList.remove("hidden");
};
gameCloseBtn.onclick = () => gameModal.classList.add("hidden");

// 3. Location Selection
const savedLocation = localStorage.getItem("pokemon_grid_location");
if (savedLocation) {
  locationDisplay.innerText = savedLocation;
  locationDisplay.classList.remove("placeholder");
}

function buildLocationTabs() {
  locGenTabsEl.innerHTML = "";
  Object.keys(REGION_LOCATIONS).forEach((genKey) => {
    const btn = document.createElement("button");
    btn.className = `gen-tab-btn ${genKey === activeLocGenKey ? "active" : ""}`;
    btn.innerText = genKey;
    btn.onclick = () => {
      activeLocGenKey = genKey;
      document.querySelectorAll("#loc-gen-tabs .gen-tab-btn").forEach((b) => {
        b.classList.toggle("active", b.innerText === genKey);
      });
      renderLocationList();
    };
    locGenTabsEl.appendChild(btn);
  });
}

function renderLocationList() {
  const query = locSearchInput.value.toLowerCase().trim();
  let list = REGION_LOCATIONS[activeLocGenKey] || [];

  if (query) {
    list = list.filter((loc) => loc.toLowerCase().includes(query));
  }

  locationListEl.innerHTML = "";
  list.forEach((loc) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerText = loc;
    item.onclick = () => {
      locationDisplay.innerText = loc;
      locationDisplay.classList.remove("placeholder");
      localStorage.setItem("pokemon_grid_location", loc);
      locationModal.classList.add("hidden");
    };
    locationListEl.appendChild(item);
  });
}

locationPill.onclick = () => {
  locSearchInput.value = "";
  buildLocationTabs();
  renderLocationList();
  locationModal.classList.remove("hidden");
};
locSearchInput.addEventListener("input", renderLocationList);
locationCloseBtn.onclick = () => locationModal.classList.add("hidden");

// 4. Poké Ball Selector
const BALL_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/";
const savedBall = localStorage.getItem("pokemon_grid_ball") || (BALL_BASE + "poke-ball.png");
trainerBallImg.src = savedBall;

function buildBallGrid() {
  ballGrid.innerHTML = "";
  POKEBALLS.forEach((b) => {
    const url = `${BALL_BASE}${b.slug}.png`;
    const card = document.createElement("div");
    card.className = "ball-card";
    card.innerHTML = `
      <img src="${url}" crossOrigin="anonymous" alt="${b.name}" />
      <span>${b.name}</span>
    `;
    card.onclick = () => {
      trainerBallImg.src = url;
      localStorage.setItem("pokemon_grid_ball", url);
      ballModal.classList.add("hidden");
    };
    ballGrid.appendChild(card);
  });
}

ballBtn.onclick = () => {
  buildBallGrid();
  ballModal.classList.remove("hidden");
};
ballCloseBtn.onclick = () => ballModal.classList.add("hidden");

// 5. Render Pokémon Grid Cards
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

// 6. Fetch Pokémon List
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

// 7. Gen Tabs & Filtering (Context-Sensitive)
function buildGenTabs() {
  genTabsEl.innerHTML = "";
  GENERATIONS.forEach((g, idx) => {
    const btn = document.createElement("button");
    btn.className = `gen-tab-btn ${idx === activeGenIndex ? "active" : ""}`;
    btn.innerText = g.gen;
    btn.onclick = () => {
      activeGenIndex = idx;
      document.querySelectorAll("#gen-tabs .gen-tab-btn").forEach((b, i) => {
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
  const categoryName = categories[activeSlotIndex] || "";

  // 1. Initial Generation Slice
  let list = allPokemon.filter((p) => p.id >= currentGen.start && p.id <= currentGen.end);

  // 2. Apply Category Restrictions
  if (categoryName === "Best Starter") {
    list = list.filter((p) => STARTER_IDS.has(p.id));
  } else if (categoryName === "Best Mythical") {
    list = list.filter((p) => MYTHICAL_IDS.has(p.id));
  } else if (categoryName === "Best Legendary") {
    list = list.filter((p) => LEGENDARY_IDS.has(p.id));
  } else if (categoryName === "Best Eeveelution") {
    list = list.filter((p) => EEVEELUTION_IDS.has(p.id));
  }

  // 3. Search query filter
  if (query) {
    list = list.filter((p) => p.name.toLowerCase().includes(query) || String(p.id).includes(query));
  }

  pokemonListEl.innerHTML = "";
  
  if (list.length === 0) {
    const emptyNotice = document.createElement("div");
    emptyNotice.style.gridColumn = "1 / -1";
    emptyNotice.style.textAlign = "center";
    emptyNotice.style.padding = "20px";
    emptyNotice.style.color = "#8fa0b5";
    emptyNotice.style.fontSize = "13px";
    emptyNotice.innerText = "No qualifying Pokémon in this Generation.";
    pokemonListEl.appendChild(emptyNotice);
    return;
  }

  list.forEach((p) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `<span class="item-tag">#${p.id}</span> <span>${p.name}</span>`;
    item.onclick = () => selectPokemon(p.id);
    pokemonListEl.appendChild(item);
  });
}

// 8. Open Picker Modal
function openPicker(slotIdx) {
  activeSlotIndex = slotIdx;
  const categoryName = categories[slotIdx];
  modalCategoryTitle.innerText = categoryName;

  // Add contextual hint based on slot restrictions
  if (categoryName === "Best Starter") {
    modalCategoryFilterNote.innerText = "Showing official Starter Pokémon & evolutions only.";
  } else if (categoryName === "Best Mythical") {
    modalCategoryFilterNote.innerText = "Showing official Mythical Pokémon only.";
  } else if (categoryName === "Best Legendary") {
    modalCategoryFilterNote.innerText = "Showing official Legendary Pokémon only.";
  } else if (categoryName === "Best Eeveelution") {
    modalCategoryFilterNote.innerText = "Showing Eevee and its 8 evolutions only.";
  } else {
    modalCategoryFilterNote.innerText = "All Pokémon eligible.";
  }

  shinyToggle.checked = slotIdx === 11; // Auto-select for 'Best looking shiny'
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
modalCloseBtn.onclick = () => pickerModal.classList.add("hidden");
openSettingsBtn.onclick = () => settingsModal.classList.remove("hidden");
settingsCloseBtn.onclick = () => settingsModal.classList.add("hidden");

// 9. Export Image (Download)
downloadBtn.onclick = () => {
  const target = document.getElementById("grid-wrapper");
  html2canvas(target, { useCORS: true, backgroundColor: "#191e24", scale: 2 }).then((canvas) => {
    const link = document.createElement("a");
    const trainerName = trainerInput.value.trim().replace(/\s+/g, "-") || "trainer";
    link.download = `pokegrid-${trainerName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
};

// 10. Copy Image to Clipboard
copyBtn.onclick = async () => {
  const target = document.getElementById("grid-wrapper");
  const originalText = copyBtn.innerText;

  try {
    const canvas = await html2canvas(target, { useCORS: true, backgroundColor: "#191e24", scale: 2 });
    canvas.toBlob(async (blob) => {
      if (!blob) throw new Error("Blob conversion failed");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
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
};

// 11. Reset Grid
openResetBtn.onclick = () => confirmModal.classList.remove("hidden");
cancelResetBtn.onclick = () => confirmModal.classList.add("hidden");
confirmResetBtn.onclick = () => {
  gridState = {};
  localStorage.removeItem("pokemon_grid_data");
  renderGrid();
  confirmModal.classList.add("hidden");
};

// 12. PWA Install Logic
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  pwaInstallBtn.innerText = "Install App";
});

pwaInstallBtn.onclick = async () => {
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
      alert("To install on iOS: tap Share in Safari, then 'Add to Home Screen'.");
    } else {
      alert("To install: use your browser's menu and select 'Install PokéGrid' or 'Add to Home screen'.");
    }
  }
};

window.addEventListener("appinstalled", () => {
  pwaInstallBtn.innerText = "App Installed!";
  pwaInstallBtn.disabled = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(console.error);
  });
}

// Initial Run
buildGenTabs();
fetchPokemonList();
renderGrid();