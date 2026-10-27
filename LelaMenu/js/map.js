// The MapLibre globe: base map, satellite fade-in, pin layers, camera helpers.

const STYLE_URL = "https://tiles.openfreemap.org/styles/dark";
// "satellite": natural Earth colours at every zoom. "dark": the earlier wine-dark map,
// with satellite fading in only near vineyards.
const BASEMAP = "satellite";
const SATELLITE = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = matchMedia("(pointer: coarse)").matches;

export const HOME = { center: [8, 34], zoom: innerWidth < 600 ? 1.1 : 2.1, pitch: 0, bearing: 0 };

export function createMap(container, { onPick, onPickCluster, onBackgroundTap }) {
  const map = new maplibregl.Map({
    container,
    style: STYLE_URL,
    ...HOME,
    maxPitch: 60,
    attributionControl: { compact: true },
    renderWorldCopies: false,
    fadeDuration: 150,
  });
  // Rotating with two fingers disorients people on phones; keep pinch-zoom, drop twist.
  if (isTouch) map.touchZoomRotate.disableRotation();
  map.keyboard.enable();
  // The basemap style references a few icons its sprite doesn't ship; give them a blank image.
  map.on("styleimagemissing", (e) => {
    if (!map.hasImage(e.id)) map.addImage(e.id, { width: 1, height: 1, data: new Uint8Array(4) });
  });

  map.on("style.load", () => {
    map.setProjection({ type: "globe" });
    map.setSky(
      BASEMAP === "satellite"
        ? {
            "sky-color": "#1f100a",
            "horizon-color": "#a9cdef",
            "fog-color": "#cfe0ef",
            "sky-horizon-blend": 0.55,
            "horizon-fog-blend": 0.5,
            "fog-ground-blend": 0.92,
            "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 1, 5, 1, 8, 0],
          }
        : {
            "sky-color": "#1f100a",
            "horizon-color": "#4a2433",
            "fog-color": "#1f100a",
            "sky-horizon-blend": 0.7,
            "horizon-fog-blend": 0.6,
            "fog-ground-blend": 0.85,
            "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 1, 5, 1, 8, 0],
          }
    );
    if (BASEMAP === "dark") warmBasemap(map);
    else lightLabels(map);
    addSatellite(map);
    addPinLayers(map);
  });

  // Start the map credits collapsed to the ⓘ button so they don't cover the UI on phones.
  map.once("load", () =>
    map.getContainer().querySelector(".maplibregl-compact-show")?.classList.remove("maplibregl-compact-show")
  );

  // Tap/click handling
  const hit = ["pin-hit", "clusters"];
  map.on("click", (e) => {
    const f = map.queryRenderedFeatures(e.point, { layers: hit.filter((l) => map.getLayer(l)) })[0];
    if (!f) return onBackgroundTap?.();
    if (f.properties.cluster) onPickCluster(f);
    else onPick(f.properties.key);
  });
  for (const layer of hit) {
    map.on("mouseenter", layer, () => (map.getCanvas().style.cursor = "pointer"));
    map.on("mouseleave", layer, () => (map.getCanvas().style.cursor = ""));
  }

  // Desktop hover label
  if (!isTouch) {
    const tip = new maplibregl.Popup({ closeButton: false, closeOnClick: false, className: "hover-tip", offset: 12 });
    map.on("mousemove", "pin-hit", (e) => {
      const f = e.features[0];
      tip.setLngLat(f.geometry.coordinates).setText(f.properties.label).addTo(map);
    });
    map.on("mouseleave", "pin-hit", () => tip.remove());
  }

  return map;
}

function firstSymbolLayer(map) {
  return map.getStyle().layers.find((l) => l.type === "symbol")?.id;
}

// Nudge the grey dark basemap toward the bar's warm, wine-dark palette.
function warmBasemap(map) {
  const set = (id, prop, value) => map.getLayer(id) && map.setPaintProperty(id, prop, value);
  set("background", "background-color", "#2a1c16");
  set("water", "fill-color", "#120906");
}

// The dark style's labels are dark grey; over satellite imagery they need to be light.
function lightLabels(map) {
  for (const layer of map.getStyle().layers) {
    if (layer.type !== "symbol" || !layer.layout?.["text-field"]) continue;
    map.setPaintProperty(layer.id, "text-color", "rgba(245, 237, 227, 0.92)");
    map.setPaintProperty(layer.id, "text-halo-color", "rgba(31, 16, 10, 0.85)");
    map.setPaintProperty(layer.id, "text-halo-width", 1.2);
  }
}

// Satellite imagery: natural colours everywhere, or fading in near vineyards on the dark map.
function addSatellite(map) {
  map.addSource("satellite", {
    type: "raster",
    tiles: [SATELLITE],
    tileSize: 256,
    maxzoom: 19,
    attribution: "Imagery © Esri, Maxar, Earthstar Geographics",
  });
  map.addLayer(
    {
      id: "satellite",
      type: "raster",
      source: "satellite",
      minzoom: BASEMAP === "satellite" ? 0 : 7,
      paint: {
        "raster-opacity": BASEMAP === "satellite" ? 1 : ["interpolate", ["linear"], ["zoom"], 7.5, 0, 10, 0.92],
        "raster-fade-duration": 200,
      },
    },
    firstSymbolLayer(map)
  );
}

function addPinLayers(map) {
  map.addSource("wines", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
    cluster: true,
    clusterRadius: 42,
    clusterMaxZoom: 15,
    clusterProperties: { wines: ["+", ["get", "count"]] },
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "wines",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": "rgba(31, 16, 10, 0.88)",
      "circle-radius": ["step", ["get", "wines"], 15, 10, 19, 40, 24, 120, 30],
      "circle-stroke-width": 2.5,
      "circle-stroke-color": "#a0c65e",
    },
  });
  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "wines",
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["to-string", ["get", "wines"]],
      "text-font": ["Noto Sans Bold"],
      "text-size": 13,
      "text-allow-overlap": true,
    },
    paint: { "text-color": "#f5ede3" },
  });

  // A soft halo marks pins that only know the appellation or region, not the exact spot.
  map.addLayer({
    id: "pin-approx",
    type: "circle",
    source: "wines",
    filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "approx"], 1]],
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 10, 9, 22],
      "circle-color": ["get", "ring"],
      "circle-opacity": 0.16,
      "circle-stroke-width": 1,
      "circle-stroke-color": ["get", "ring"],
      "circle-stroke-opacity": 0.4,
    },
  });
  map.addLayer({
    id: "pins",
    type: "circle",
    source: "wines",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-radius": ["case", [">", ["get", "count"], 1], 9, 6.5],
      "circle-color": ["get", "color"],
      "circle-stroke-width": ["case", ["==", ["get", "mixed"], 1], 2.5, 2],
      "circle-stroke-color": ["case", ["==", ["get", "mixed"], 1], "#a0c65e", "#1f100a"],
    },
  });
  map.addLayer({
    id: "pin-count",
    type: "symbol",
    source: "wines",
    filter: ["all", ["!", ["has", "point_count"]], [">", ["get", "count"], 1]],
    layout: {
      "text-field": ["to-string", ["get", "count"]],
      "text-font": ["Noto Sans Bold"],
      "text-size": 10,
      "text-allow-overlap": true,
    },
    paint: { "text-color": ["case", ["==", ["get", "mixed"], 1], "#f5ede3", "#1f100a"] },
  });
  map.addLayer({
    id: "pin-label",
    type: "symbol",
    source: "wines",
    minzoom: 10,
    filter: ["!", ["has", "point_count"]],
    layout: {
      "text-field": ["get", "label"],
      "text-font": ["Noto Sans Regular"],
      "text-size": 12,
      "text-offset": [0, 1.3],
      "text-anchor": "top",
      "text-max-width": 10,
      "text-optional": true,
    },
    paint: { "text-color": "#f4ece4", "text-halo-color": "rgba(31,16,10,.9)", "text-halo-width": 1.4 },
  });
  map.addLayer({
    id: "pin-selected",
    type: "circle",
    source: "wines",
    filter: ["==", ["get", "key"], ""],
    paint: {
      "circle-radius": 15,
      "circle-color": "rgba(0,0,0,0)",
      "circle-stroke-width": 2.5,
      "circle-stroke-color": "#a0c65e",
    },
  });
  // Invisible, larger hit area so pins are easy to tap (≥ 44px).
  map.addLayer({
    id: "pin-hit",
    type: "circle",
    source: "wines",
    filter: ["!", ["has", "point_count"]],
    paint: { "circle-radius": 22, "circle-color": "#000", "circle-opacity": 0.001 },
  });
}

export function setPins(map, geojson) {
  const src = map.getSource("wines");
  if (src) src.setData(geojson);
}

export function setSelected(map, key) {
  if (map.getLayer("pin-selected")) map.setFilter("pin-selected", ["==", ["get", "key"], key ?? ""]);
}

export function flyTo(map, { lng, lat, zoom, padding }) {
  const opts = { center: [lng, lat], zoom, padding, pitch: zoom >= 11 ? 45 : 0, essential: true };
  if (reducedMotion) map.jumpTo(opts);
  else map.flyTo({ ...opts, speed: 1.4, curve: 1.5 });
}

export function goHome(map, padding) {
  const opts = { ...HOME, padding };
  reducedMotion ? map.jumpTo(opts) : map.flyTo({ ...opts, speed: 1.6 });
}

// Slow spin until the first interaction.
export function idleSpin(map) {
  if (reducedMotion) return () => {};
  let on = true;
  const stop = () => (on = false);
  for (const ev of ["mousedown", "touchstart", "wheel", "dragstart", "keydown"]) {
    map.getCanvasContainer().addEventListener(ev, stop, { once: true, passive: true });
  }
  const step = () => {
    if (!on || map.getZoom() > 3 || map.isMoving()) return;
    const c = map.getCenter();
    map.easeTo({ center: [c.lng - 6, c.lat], duration: 1000, easing: (t) => t });
  };
  map.on("moveend", step);
  map.once("idle", step);
  return stop;
}
