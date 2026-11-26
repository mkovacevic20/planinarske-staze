const STORAGE_KEY = "mojeStaze";

const TEZINE = {
  lako: { naziv: "Lako", opis: "Lako – kratka staza bez većih uspona, pogodna za početnike i obitelji." },
  srednje: { naziv: "Srednje", opis: "Srednje – potrebna osnovna kondicija, ponegdje strmiji dijelovi." },
  tesko: { naziv: "Teško", opis: "Teško – dug i strm uspon, za iskusne planinare s dobrom kondicijom." }
};

const trailList = document.getElementById("trail-list");
const featuredList = document.getElementById("featured-trails");
const myTrailsList = document.getElementById("my-trails-list");
const resultCount = document.getElementById("result-count");
const searchInput = document.getElementById("search");
const filterTezina = document.getElementById("filter-tezina");
const filterRegija = document.getElementById("filter-regija");
const filterTrajanje = document.getElementById("filter-trajanje");
const resetButton = document.getElementById("filter-reset");

let staze = [];
let mojeStaze = loadMojeStaze();

function loadStaze() {
  if (typeof STAZE === "undefined") {
    console.error("Nedostaje data/staze.js – dodaj <script src=\"data/staze.js\"> prije js/staze.js");
    const target = trailList || featuredList;
    if (target) target.appendChild(createMessage("Staze se nisu mogle učitati."));
    return;
  }

  staze = STAZE;

  if (trailList) {
    primijeniRegijuIzAdrese();
    filtriraj();
  }
  if (featuredList) renderStaze(staze.filter(s => s.istaknuta), featuredList);
  prikaziBrojStazaPoRegiji();
  renderMojeStaze();
}

function brojStaza(n) {
  const zadnja = n % 10, zadnjeDvije = n % 100;
  if (zadnja === 1 && zadnjeDvije !== 11) return n + " staza";
  if (zadnja >= 2 && zadnja <= 4 && (zadnjeDvije < 12 || zadnjeDvije > 14)) return n + " staze";
  return n + " staza";
}

function prikaziBrojStazaPoRegiji() {
  document.querySelectorAll(".region-tile[data-regija]").forEach(tile => {
    const n = staze.filter(s => s.regija === tile.dataset.regija).length;
    tile.querySelector(".region-count").textContent = brojStaza(n);
  });
}

function primijeniRegijuIzAdrese() {
  const regija = new URLSearchParams(window.location.search).get("regija");
  const postoji = Array.from(filterRegija.options).some(o => o.value === regija);
  if (regija && postoji) filterRegija.value = regija;
}

function createMessage(text) {
  const p = document.createElement("p");
  p.className = "empty-message";
  p.textContent = text;
  return p;
}

function formatSati(sati) {
  return String(sati).replace(".", ",") + " h";
}

function createDetailRow(label, value) {
  const fragment = document.createDocumentFragment();
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.textContent = value;
  fragment.append(dt, dd);
  return fragment;
}

function createCard(staza) {
  const card = document.createElement("article");
  card.className = "card trail-card tezina-" + staza.tezina;
  card.dataset.id = staza.id;

  const title = document.createElement("h3");
  title.textContent = staza.naziv;

  const badge = document.createElement("span");
  badge.className = "badge badge-" + staza.tezina;
  badge.textContent = TEZINE[staza.tezina].naziv;
  badge.dataset.tooltip = TEZINE[staza.tezina].opis;
  badge.tabIndex = 0;

  const tooltip = document.createElement("span");
  tooltip.className = "badge-tooltip";
  tooltip.id = "tooltip-" + staza.id;
  tooltip.setAttribute("role", "tooltip");
  tooltip.textContent = TEZINE[staza.tezina].opis;
  badge.setAttribute("aria-describedby", tooltip.id);
  badge.appendChild(tooltip);

  const meta = document.createElement("p");
  meta.className = "trail-meta";
  meta.textContent = `${staza.regija} · ${formatSati(staza.trajanje)} · ${staza.duljina} km`;

  const details = document.createElement("div");
  details.className = "trail-details hidden";
  details.id = "detalji-" + staza.id;

  const opis = document.createElement("p");
  opis.textContent = staza.opis;

  const dl = document.createElement("dl");
  dl.append(
    createDetailRow("Polazište", staza.polaziste),
    createDetailRow("Cilj", staza.vrh),
    createDetailRow("Visinska razlika", staza.visinskaRazlika + " m"),
    createDetailRow("Duljina", staza.duljina + " km (u jednom smjeru)")
  );
  details.append(opis, dl);

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const detailsBtn = document.createElement("button");
  detailsBtn.type = "button";
  detailsBtn.className = "btn btn-outline btn-small";
  detailsBtn.dataset.action = "detalji";
  detailsBtn.setAttribute("aria-expanded", "false");
  detailsBtn.setAttribute("aria-controls", details.id);
  detailsBtn.textContent = "Detalji";

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-small";
  addBtn.dataset.action = "moje";
  updateAddButton(addBtn, staza.id);

  actions.append(detailsBtn, addBtn);
  card.append(title, badge, meta, details, actions);
  return card;
}

function renderStaze(lista, container) {
  container.innerHTML = "";

  if (lista.length === 0) {
    container.appendChild(createMessage("Nijedna staza ne odgovara odabranim filterima."));
    return;
  }

  lista.forEach(staza => container.appendChild(createCard(staza)));
}

function normaliziraj(tekst) {
  return tekst.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
}

function odgovaraTrajanju(trajanje, filter) {
  if (filter === "") return true;
  if (filter === "99") return trajanje > 5;
  return trajanje <= Number(filter);
}

function filtriraj() {
  const upit = normaliziraj(searchInput.value.trim());
  const tezina = filterTezina.value;
  const regija = filterRegija.value;
  const trajanje = filterTrajanje.value;

  const rezultat = staze.filter(staza =>
    normaliziraj(staza.naziv).includes(upit) &&
    (tezina === "" || staza.tezina === tezina) &&
    (regija === "" || staza.regija === regija) &&
    odgovaraTrajanju(staza.trajanje, trajanje)
  );

  renderStaze(rezultat, trailList);
  resultCount.textContent = `Prikazano ${rezultat.length} od ${staze.length} staza`;
}

if (trailList) {
  searchInput.addEventListener("input", filtriraj);
  [filterTezina, filterRegija, filterTrajanje].forEach(select =>
    select.addEventListener("change", filtriraj)
  );
  resetButton.addEventListener("click", () => {
    document.getElementById("filters").reset();
    filtriraj();
    searchInput.focus();
  });
}

function handleCardClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const card = button.closest(".trail-card");
  const id = Number(card.dataset.id);

  if (button.dataset.action === "detalji") {
    const details = card.querySelector(".trail-details");
    const otvoreno = details.classList.toggle("hidden") === false;
    button.textContent = otvoreno ? "Sakrij detalje" : "Detalji";
    button.setAttribute("aria-expanded", String(otvoreno));
  }

  if (button.dataset.action === "moje") {
    if (mojeStaze.includes(id)) {
      ukloniIzMojih(id);
    } else {
      dodajUMoje(id);
    }
  }
}

if (trailList) trailList.addEventListener("click", handleCardClick);
if (featuredList) featuredList.addEventListener("click", handleCardClick);

function loadMojeStaze() {
  try {
    const spremljeno = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(spremljeno) ? spremljeno : [];
  } catch (e) {
    return [];
  }
}

function saveMojeStaze() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mojeStaze));
  } catch (e) {
  }
}

function dodajUMoje(id) {
  if (!mojeStaze.includes(id)) mojeStaze.push(id);
  saveMojeStaze();
  osvjeziMojeStaze();
}

function ukloniIzMojih(id) {
  mojeStaze = mojeStaze.filter(m => m !== id);
  saveMojeStaze();
  osvjeziMojeStaze();
}

function updateAddButton(button, id) {
  const dodano = mojeStaze.includes(id);
  button.textContent = dodano ? "✓ U mojim stazama" : "+ Moje staze";
  button.classList.toggle("btn-added", dodano);
  button.setAttribute("aria-pressed", String(dodano));
}

function osvjeziMojeStaze() {
  document.querySelectorAll('.trail-card button[data-action="moje"]').forEach(button => {
    updateAddButton(button, Number(button.closest(".trail-card").dataset.id));
  });
  renderMojeStaze();
}

function renderMojeStaze() {
  if (!myTrailsList) return;
  myTrailsList.innerHTML = "";

  const odabrane = mojeStaze
    .map(id => staze.find(s => s.id === id))
    .filter(Boolean);

  if (odabrane.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-message";
    li.textContent = "Još nisi dodao nijednu stazu. Klikni „+ Moje staze” na kartici.";
    myTrailsList.appendChild(li);
    return;
  }

  odabrane.forEach(staza => {
    const li = document.createElement("li");

    const naziv = document.createElement("span");
    naziv.textContent = `${staza.naziv} (${formatSati(staza.trajanje)})`;

    const ukloni = document.createElement("button");
    ukloni.type = "button";
    ukloni.className = "remove-btn";
    ukloni.setAttribute("aria-label", "Ukloni " + staza.naziv);
    ukloni.textContent = "✕";
    ukloni.addEventListener("click", () => ukloniIzMojih(staza.id));

    li.append(naziv, ukloni);
    myTrailsList.appendChild(li);
  });

  const ukupno = odabrane.reduce((zbroj, s) => zbroj + s.trajanje, 0);
  const sazetak = document.createElement("li");
  sazetak.className = "my-trails-summary";
  sazetak.textContent = `Ukupno: ${odabrane.length} staza, oko ${formatSati(ukupno)} hoda`;
  myTrailsList.appendChild(sazetak);
}

loadStaze();
