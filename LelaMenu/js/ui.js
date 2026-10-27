// The detail panel (bottom sheet on phones, side panel on desktop) and what goes in it.
import { STYLE_COLOR, PRICE_BANDS, money } from "./data.js";

const panel = document.getElementById("panel");
const body = document.getElementById("panel-body");
const grip = document.getElementById("panel-grip");
const desktop = matchMedia("(min-width: 900px)");

export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

let onStateChange = () => {};
export function onPanelChange(fn) {
  onStateChange = fn;
}

export function panelState() {
  return panel.dataset.state;
}

export function openPanel(html, state = "half") {
  body.innerHTML = html;
  body.scrollTop = 0;
  setState(desktop.matches ? "full" : state);
}

export function closePanel() {
  setState("closed");
}

function setState(state) {
  panel.dataset.state = state;
  panel.setAttribute("aria-hidden", state === "closed");
  document.body.classList.toggle("panel-open", state !== "closed");
  onStateChange(state);
}

// Camera padding so the selected pin isn't hidden behind the panel.
export function cameraPadding() {
  const s = panel.dataset.state;
  if (s === "closed") return { top: 0, bottom: 0, left: 0, right: 0 };
  if (desktop.matches) return { top: 0, bottom: 0, left: 0, right: 420 };
  return { top: 120, bottom: s === "full" ? 0 : Math.round(innerHeight * 0.52), left: 0, right: 0 };
}

// Drag the grip to move the sheet between half, full and closed.
(function sheetDrag() {
  let startY = 0, startT = 0, base = 0, dy = 0, dragging = false;
  const offset = () => ({ full: 0, half: panel.offsetHeight * 0.48, closed: panel.offsetHeight })[panel.dataset.state];
  grip.addEventListener("pointerdown", (e) => {
    if (desktop.matches) return;
    dragging = true;
    startY = e.clientY;
    startT = performance.now();
    base = offset();
    dy = 0;
    panel.classList.add("dragging");
    grip.setPointerCapture(e.pointerId);
  });
  grip.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    dy = e.clientY - startY;
    panel.style.transform = `translateY(${Math.max(0, base + dy)}px)`;
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    panel.classList.remove("dragging");
    panel.style.transform = "";
    const v = dy / Math.max(1, performance.now() - startT); // px per ms
    const pos = base + dy;
    const h = panel.offsetHeight;
    let next;
    if (Math.abs(dy) < 6) next = panel.dataset.state === "full" ? "half" : "full"; // a tap toggles
    else if (v > 0.6) next = panel.dataset.state === "full" ? "half" : "closed";
    else if (v < -0.6) next = "full";
    else next = pos < h * 0.25 ? "full" : pos < h * 0.72 ? "half" : "closed";
    setState(next);
  };
  grip.addEventListener("pointerup", end);
  grip.addEventListener("pointercancel", end);
})();

const dot = (style) => `<span class="dot" style="background:${STYLE_COLOR[style] ?? "#a0c65e"}"></span>`;
const pinIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>`;

function placeLine(w) {
  return [w.appellation, w.region !== w.appellation ? w.region : "", w.country].filter(Boolean).join(", ");
}

export function renderWine(w) {
  const rows = w.bottles
    .map(
      (b) => `<tr>
        <td><span class="vintage">${esc(b.vintage || "—")}</span></td>
        <td class="fmt">${esc(b.format)}${b.designation && b.designation !== w.designation ? `<br>${esc(b.designation)}` : ""}${b.appellation ? `<br>Labelled ${esc(b.appellation)}` : ""}</td>
        <td><span class="price">${money(b.price)}</span>
          <span class="half ${b.half_pour ? "" : "no"}">${b.half_pour ? "Half-bottle pour OK" : "Full bottle only"}</span></td>
      </tr>`
    )
    .join("");
  return `
    <p class="eyebrow">${esc(w.sections.join(" · "))}</p>
    <h2 class="wine-title">${esc(w.producer)}</h2>
    ${w.subtitle ? `<p class="wine-sub">${esc(w.subtitle)}</p>` : ""}
    <div class="meta">
      <span class="tag">${dot(w.style)}${esc(w.style)}</span>
      ${w.designation ? `<span class="tag">${esc(w.designation)}</span>` : ""}
    </div>
    ${w.grapes ? `<p class="grapes">${esc(w.grapes)}${w.grapes_listed ? "" : ` <em>(typical for the style)</em>`}</p>` : ""}
    <div class="place">${pinIcon}<div><strong>${esc(placeLine(w))}</strong><small>${esc(w.place_note)}${w.precision === "estate" || w.precision === "vineyard" ? ` · ${esc(w.place)}` : ""}</small></div></div>
    <table class="bottles">
      <thead><tr><th>Vintage</th><th>Format</th><th>Price</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function wineRow(w) {
  const px = w.price_min === w.price_max ? money(w.price_min) : `${money(w.price_min)}–${money(w.price_max)}`;
  const vintages = w.bottles.map((b) => b.vintage).filter(Boolean);
  const sub = [w.subtitle, w.appellation || w.country, vintages.length > 1 ? `${vintages.length} vintages` : vintages[0]]
    .filter(Boolean)
    .join(" · ");
  return `<button class="wine-row" data-wine="${esc(w.id)}">
      ${dot(w.style)}
      <span><span class="name">${esc(w.producer)}</span><br><span class="sub">${esc(sub)}</span></span>
      <span class="px">${px}</span>
    </button>`;
}

export function renderLocation(wines) {
  const place = wines[0].place || wines[0].appellation;
  return `
    <div class="list-head"><h2>${esc(place)}</h2><span>${wines.length} wines</span></div>
    <p class="grapes">${esc(placeLine(wines[0]))}</p>
    ${wines.map(wineRow).join("")}`;
}

export function renderList(wines, sections, { title = "The list", onlySearch = false } = {}) {
  if (!wines.length) {
    return `<div class="list-head"><h2>${esc(title)}</h2></div>
      <div class="empty">No wines match.<br><button class="text-btn" data-action="reset">Clear filters</button></div>`;
  }
  const bySection = new Map(sections.map((s) => [s.name, []]));
  for (const w of wines) bySection.get(w.sections[0])?.push(w);
  const bottles = wines.reduce((n, w) => n + w.bottles.length, 0);
  let html = `<div class="list-head"><h2>${esc(title)}</h2><span>${wines.length} wines · ${bottles} bottles</span></div>`;
  for (const s of sections) {
    const list = bySection.get(s.name);
    if (!list?.length) continue;
    html += `<div class="list-section"><h3>${esc(s.name)}</h3>${onlySearch ? "" : `<p class="tagline">${esc(s.tagline)}</p>`}${list.map(wineRow).join("")}</div>`;
  }
  return html;
}

export function renderFilters(f, sections) {
  const sectionOpts = sections
    .map((s) => `<option value="${esc(s.name)}" ${f.section === s.name ? "selected" : ""}>${esc(s.name)}</option>`)
    .join("");
  const bands = PRICE_BANDS.map(
    (b) => `<button data-price="${b.key}" aria-pressed="${f.price === b.key}">${esc(b.label)}</button>`
  ).join("");
  return `
    <div class="list-head"><h2>Filters</h2></div>
    <div class="field"><span class="label">Price per bottle</span><div class="seg" id="price-seg">${bands}</div></div>
    <div class="field"><label for="section-select">Section of the list</label>
      <select id="section-select"><option value="">All sections</option>${sectionOpts}</select></div>
    <label class="toggle"><span>Only bottles we can open for a half-bottle pour</span>
      <input type="checkbox" id="halfpour-toggle" ${f.halfPour ? "checked" : ""}></label>
    <p><button class="text-btn" data-action="reset">Clear all filters</button></p>`;
}
