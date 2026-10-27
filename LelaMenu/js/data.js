// Loading, searching and filtering the wine list, and turning it into map features.

export const STYLES = [
  { key: "Red", color: "#c23a52" },
  { key: "White", color: "#e6cf6a" },
  { key: "Sparkling", color: "#f3ecc4" },
  { key: "Rosé", color: "#f095aa" },
  { key: "Orange", color: "#e8913a" },
  { key: "Sweet", color: "#c47f22" },
  { key: "Fortified", color: "#8c4a5c" },
  { key: "Amaro & Vermouth", color: "#86a36a" },
];
export const STYLE_COLOR = Object.fromEntries(STYLES.map((s) => [s.key, s.color]));
// Clusters and spots holding several styles use the theme's dark base with a green ring,
// so they never look like one particular style of wine.
export const MULTI_FILL = "#1f100a";
export const MULTI_RING = "#a0c65e";

export const PRICE_BANDS = [
  { key: "any", label: "Any price", min: 0, max: Infinity },
  { key: "u100", label: "Under $100", min: 0, max: 99 },
  { key: "100", label: "$100–250", min: 100, max: 250 },
  { key: "250", label: "$250–500", min: 251, max: 500 },
  { key: "500", label: "$500–1,000", min: 501, max: 1000 },
  { key: "1000", label: "$1,000+", min: 1001, max: Infinity },
];

// Camera zoom to use when flying to a wine, by how precise its pin is.
export const ZOOM_FOR = { vineyard: 14.2, estate: 13.2, village: 12, appellation: 9.5, region: 7, country: 5 };
const APPROXIMATE = new Set(["appellation", "region", "country"]);

export const fold = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export const money = (n) => "$" + n.toLocaleString("en-US");

export async function loadWines(url = "data/wines.json") {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Couldn't load ${url} (${res.status})`);
  const data = await res.json();
  for (const w of data.wines) {
    w.title = w.producer;
    w.subtitle = [w.cuvee, w.vineyard].filter(Boolean).join(" · ");
    w.core = fold(
      [w.producer, w.cuvee, w.vineyard, w.designation, w.grapes, w.appellation, w.region, w.country,
        w.style, ...w.bottles.map((b) => [b.vintage, b.appellation, b.designation].join(" "))].join(" ")
    );
    w.haystack = w.core + " " + fold(w.sections.join(" "));
    w.locKey = `${w.lat},${w.lng}`;
  }
  return data;
}

// Returns the wines that pass every active filter.
export function applyFilters(wines, f) {
  const terms = fold(f.q).split(/\s+/).filter(Boolean);
  const band = PRICE_BANDS.find((b) => b.key === f.price) ?? PRICE_BANDS[0];
  const result = wines.filter((w) => {
    if (f.styles.size && !f.styles.has(w.style)) return false;
    if (f.section && !w.sections.includes(f.section)) return false;
    if (terms.length && !terms.every((t) => w.haystack.includes(t))) return false;
    if (f.halfPour || band.key !== "any") {
      const ok = w.bottles.some(
        (b) => (!f.halfPour || b.half_pour) && b.price >= band.min && b.price <= band.max
      );
      if (!ok) return false;
    }
    return true;
  });
  // Prefer wines that match on their own details; a section-name match ("Barbaresco & Barolo")
  // only counts when nothing else matches (e.g. a search for "magnums").
  const direct = terms.length ? result.filter((w) => terms.every((t) => w.core.includes(t))) : result;
  return direct.length ? direct : result;
}

// One map feature per distinct pin location; wines that share a spot share a feature.
export function toGeoJSON(wines) {
  const byLoc = new Map();
  for (const w of wines) {
    if (!byLoc.has(w.locKey)) byLoc.set(w.locKey, []);
    byLoc.get(w.locKey).push(w);
  }
  const features = [];
  for (const [key, list] of byLoc) {
    const mixed = new Set(list.map((w) => w.style)).size > 1;
    const first = list[0];
    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: [first.lng, first.lat] },
      properties: {
        key,
        count: list.length,
        mixed: mixed ? 1 : 0,
        color: mixed ? MULTI_FILL : STYLE_COLOR[first.style],
        ring: mixed ? MULTI_RING : STYLE_COLOR[first.style],
        approx: APPROXIMATE.has(first.precision) ? 1 : 0,
        label: list.length === 1 ? first.producer : `${list.length} wines · ${first.place}`,
      },
    });
  }
  return { type: "FeatureCollection", features };
}
