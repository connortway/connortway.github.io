import { STYLES, ZOOM_FOR, loadWines, applyFilters, toGeoJSON } from "./data.js";
import { createMap, setPins, setSelected, flyTo, goHome, idleSpin } from "./map.js";
import {
  esc, openPanel, closePanel, panelState, onPanelChange, cameraPadding,
  renderWine, renderLocation, renderList, renderFilters,
} from "./ui.js";

const $ = (id) => document.getElementById(id);
const filters = { styles: new Set(), q: "", section: "", price: "any", halfPour: false };
let data, wines, byId, filtered = [], map = null;
let view = null; // what the panel shows: "wine" | "location" | "list" | "filters" | "search"
let selectedId = null;

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

async function init() {
  data = await loadWines();
  wines = data.wines;
  byId = new Map(wines.map((w) => [w.id, w]));
  buildChips();
  refresh();

  try {
    map = createMap("map", { onPick: pickLocation, onPickCluster: pickCluster, onBackgroundTap });
    map.on("load", () => {
      document.body.dataset.map = "loaded";
      refresh();
      const deep = new URLSearchParams(location.search).get("wine");
      if (deep && byId.has(deep)) selectWine(deep);
      else idleSpin(map);
    });
    map.on("error", (e) => console.warn("map:", e.error?.message ?? e));
  } catch (err) {
    console.error(err);
    $("fallback").hidden = false;
    refresh();
    showList();
  }

  wireControls();
  showHint();
}

// ---------- filtering ----------
function refresh() {
  filtered = applyFilters(wines, filters);
  if (map?.getSource("wines")) setPins(map, toGeoJSON(filtered));
  const bottles = filtered.reduce((n, w) => n + w.bottles.length, 0);
  $("count-line").textContent = `${filtered.length} wines · ${bottles} bottles`;
  const active = (filters.section ? 1 : 0) + (filters.price !== "any" ? 1 : 0) + (filters.halfPour ? 1 : 0);
  $("filter-badge").hidden = !active;
  $("filter-badge").textContent = active;
  for (const chip of document.querySelectorAll(".chip")) {
    const k = chip.dataset.style;
    chip.setAttribute("aria-pressed", k ? filters.styles.has(k) : !filters.styles.size);
  }
  if (view === "list") showList(false);
  if (view === "search") showSearch(false);
  if (selectedId && !filtered.some((w) => w.id === selectedId) && view === "wine") deselect();
}

function buildChips() {
  const counts = {};
  for (const w of wines) counts[w.style] = (counts[w.style] ?? 0) + 1;
  const chips = [`<button class="chip" data-style="" aria-pressed="true">All <span class="n">${wines.length}</span></button>`];
  for (const s of STYLES) {
    if (!counts[s.key]) continue;
    chips.push(
      `<button class="chip" data-style="${esc(s.key)}" aria-pressed="false"><span class="dot" style="background:${s.color}"></span>${esc(s.key)} <span class="n">${counts[s.key]}</span></button>`
    );
  }
  $("style-chips").innerHTML = chips.join("");
}

function resetFilters() {
  filters.styles.clear();
  filters.section = "";
  filters.price = "any";
  filters.halfPour = false;
  filters.q = "";
  $("search").value = "";
  $("search-clear").hidden = true;
  refresh();
  if (view === "filters") showFilters();
}

// ---------- selection ----------
function selectWine(id, { fly = true } = {}) {
  const w = byId.get(id);
  if (!w) return;
  selectedId = id;
  view = "wine";
  openPanel(renderWine(w), "half");
  if (map) {
    setSelected(map, w.locKey);
    if (fly) flyTo(map, { lng: w.lng, lat: w.lat, zoom: ZOOM_FOR[w.precision], padding: cameraPadding() });
  }
  history.replaceState(null, "", `?wine=${encodeURIComponent(id)}`);
}

function deselect() {
  selectedId = null;
  if (map) setSelected(map, null);
  history.replaceState(null, "", location.pathname);
}

function pickLocation(key) {
  const here = filtered.filter((w) => w.locKey === key);
  if (here.length === 1) return selectWine(here[0].id);
  if (!here.length) return;
  view = "location";
  selectedId = null;
  openPanel(renderLocation(here), "half");
  setSelected(map, key);
  const w = here[0];
  flyTo(map, { lng: w.lng, lat: w.lat, zoom: Math.max(map.getZoom(), ZOOM_FOR[w.precision] - 1), padding: cameraPadding() });
}

async function pickCluster(f) {
  const src = map.getSource("wines");
  const id = f.properties.cluster_id;
  const zoom = await src.getClusterExpansionZoom(id);
  if (zoom > 15 || map.getZoom() >= 15) {
    // These pins never separate (same spot), so list them instead of zooming forever.
    const leaves = await src.getClusterLeaves(id, Infinity);
    const keys = new Set(leaves.map((l) => l.properties.key));
    view = "location";
    openPanel(renderLocation(filtered.filter((w) => keys.has(w.locKey))), "half");
    return;
  }
  map.easeTo({ center: f.geometry.coordinates, zoom: zoom + 0.3, duration: 650, padding: cameraPadding() });
}

function onBackgroundTap() {
  if (panelState() !== "closed" && (view === "wine" || view === "location")) closePanel();
}

// ---------- panel views ----------
function showList(reset = true) {
  view = "list";
  const html = renderList(filtered, data.sections);
  if (reset || panelState() === "closed") openPanel(html, "full");
  else $("panel-body").innerHTML = html;
}

function showSearch(reset = true) {
  view = "search";
  const html = renderList(filtered, data.sections, { title: `“${filters.q}”`, onlySearch: true });
  if (reset || panelState() === "closed") openPanel(html, "half");
  else $("panel-body").innerHTML = html;
}

function showFilters() {
  view = "filters";
  openPanel(renderFilters(filters, data.sections), "full");
}

onPanelChange((state) => {
  if (state === "closed") {
    if (view === "wine" || view === "location") deselect();
    view = null;
  }
});

// ---------- controls ----------
function wireControls() {
  $("style-chips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const k = chip.dataset.style;
    if (!k) filters.styles.clear();
    else if (filters.styles.has(k)) filters.styles.delete(k);
    else filters.styles.add(k);
    refresh();
  });

  let t;
  $("search").addEventListener("input", (e) => {
    clearTimeout(t);
    t = setTimeout(() => {
      filters.q = e.target.value.trim();
      $("search-clear").hidden = !filters.q;
      refresh();
      if (filters.q) showSearch(view !== "search");
      else if (view === "search") closePanel();
    }, 140);
  });
  $("search").addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.target.blur(); // hide the phone keyboard, keep results
  });
  $("search-clear").addEventListener("click", () => {
    $("search").value = "";
    filters.q = "";
    $("search-clear").hidden = true;
    refresh();
    if (view === "search") closePanel();
  });

  $("btn-list").addEventListener("click", () => (view === "list" && panelState() !== "closed" ? closePanel() : showList()));
  $("btn-filters").addEventListener("click", () => (view === "filters" && panelState() !== "closed" ? closePanel() : showFilters()));
  $("btn-home").addEventListener("click", () => {
    closePanel();
    if (map) goHome(map, cameraPadding());
  });
  $("panel-close").addEventListener("click", closePanel);
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panelState() !== "closed") closePanel();
  });

  // Delegated clicks inside the panel
  $("panel-body").addEventListener("click", (e) => {
    const row = e.target.closest("[data-wine]");
    if (row) return selectWine(row.dataset.wine);
    const price = e.target.closest("[data-price]");
    if (price) {
      filters.price = price.dataset.price;
      refresh();
      for (const b of document.querySelectorAll("#price-seg button")) b.setAttribute("aria-pressed", b === price);
      return;
    }
    if (e.target.closest('[data-action="reset"]')) resetFilters();
  });
  $("panel-body").addEventListener("change", (e) => {
    if (e.target.id === "section-select") filters.section = e.target.value;
    if (e.target.id === "halfpour-toggle") filters.halfPour = e.target.checked;
    refresh();
  });
}

function showHint() {
  if (store.get("hint-seen")) return;
  const hint = $("hint");
  hint.hidden = false;
  const hide = () => {
    hint.classList.add("gone");
    setTimeout(() => (hint.hidden = true), 700);
    store.set("hint-seen", "1");
  };
  setTimeout(hide, 7000);
  for (const ev of ["pointerdown", "wheel", "keydown"]) addEventListener(ev, hide, { once: true, passive: true });
}

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  navigator.serviceWorker.register("sw.js").catch((err) => console.warn("service worker:", err));
}

init().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML("beforeend", `<p class="fallback">Couldn't load the wine list: ${esc(err.message)}</p>`);
});
