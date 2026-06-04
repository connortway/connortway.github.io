const grapes = {
    cabernet_sauvignon: {
      name: "Cabernet Sauvignon",
      wset: {
        color: "Deep ruby",
        body: "Full",
        acidity: "Medium+",
        tannin: "High",
        sweetness: "Dry"
      },
      aroma_flavor: ["Blackcurrant", "Black cherry", "Cedar", "Green pepper (cool climate)"],
      regions: ["Bordeaux", "Napa Valley", "Chile", "Australia"],
      styles: ["Single varietal", "Bordeaux blends", "Oaked premium wines"],
      food_pairing: ["Steak", "Lamb", "Aged cheese"],
      key_notes: ["High tannin", "Classic black fruit structure", "Often aged in oak"]
    },
  
    merlot: {
      name: "Merlot",
      wset: {
        color: "Medium ruby",
        body: "Medium to full",
        acidity: "Medium",
        tannin: "Medium",
        sweetness: "Dry"
      },
      aroma_flavor: ["Plum", "Black cherry", "Chocolate", "Herbs"],
      regions: ["Bordeaux", "California", "Chile", "Italy"],
      styles: ["Single varietal", "Bordeaux blends"],
      food_pairing: ["Roast chicken", "Beef", "Pasta"],
      key_notes: ["Softer than Cabernet Sauvignon", "Plummy fruit profile"]
    },
  
    pinot_noir: {
      name: "Pinot Noir",
      wset: {
        color: "Light ruby",
        body: "Light",
        acidity: "High",
        tannin: "Low",
        sweetness: "Dry"
      },
      aroma_flavor: ["Cherry", "Strawberry", "Raspberry", "Earth", "Mushroom"],
      regions: ["Burgundy", "Oregon", "New Zealand", "Germany"],
      styles: ["Still red", "Sparkling base wine"],
      food_pairing: ["Duck", "Salmon", "Mushrooms"],
      key_notes: ["Very delicate", "Highly terroir-sensitive"]
    },
  
    syrah: {
      name: "Syrah",
      wset: {
        color: "Deep ruby",
        body: "Full",
        acidity: "Medium+",
        tannin: "High",
        sweetness: "Dry"
      },
      aroma_flavor: ["Blackberry", "Plum", "Pepper", "Smoke", "Olive"],
      regions: ["Rhône Valley", "Australia (Shiraz)", "South Africa"],
      styles: ["Full-bodied reds", "Old vs New World contrast"],
      food_pairing: ["Grilled meat", "BBQ", "Game"],
      key_notes: ["Peppery spice is key marker"]
    },
  
    grenache: {
      name: "Grenache",
      wset: {
        color: "Pale to medium ruby",
        body: "Medium",
        acidity: "Low",
        tannin: "Medium",
        sweetness: "Dry"
      },
      aroma_flavor: ["Strawberry", "Raspberry", "White pepper", "Herbs"],
      regions: ["Southern Rhône", "Spain (Garnacha)", "Australia"],
      styles: ["GSM blends", "Rosé wines"],
      food_pairing: ["Grilled meats", "Tapas"],
      key_notes: ["High alcohol", "Soft tannins"]
    },
  
    malbec: {
      name: "Malbec",
      wset: {
        color: "Deep purple",
        body: "Full",
        acidity: "Medium",
        tannin: "High",
        sweetness: "Dry"
      },
      aroma_flavor: ["Blackberry", "Plum", "Chocolate", "Smoke"],
      regions: ["Argentina (Mendoza)", "France (Cahors)"],
      styles: ["Rich reds"],
      food_pairing: ["Steak", "BBQ"],
      key_notes: ["Dark fruit + smooth tannin"]
    },
  
    sangiovese: {
      name: "Sangiovese",
      wset: {
        color: "Medium ruby",
        body: "Medium",
        acidity: "High",
        tannin: "Medium+",
        sweetness: "Dry"
      },
      aroma_flavor: ["Cherry", "Red plum", "Herbs", "Leather"],
      regions: ["Tuscany"],
      styles: ["Chianti", "Brunello"],
      food_pairing: ["Tomato-based dishes", "Italian food"],
      key_notes: ["High acidity signature"]
    },
  
    nebbiolo: {
      name: "Nebbiolo",
      wset: {
        color: "Pale ruby (but high tannin)",
        body: "Medium",
        acidity: "High",
        tannin: "High",
        sweetness: "Dry"
      },
      aroma_flavor: ["Tar", "Rose", "Cherry", "Licorice"],
      regions: ["Piedmont"],
      styles: ["Barolo", "Barbaresco"],
      food_pairing: ["Rich meat dishes"],
      key_notes: ["Light color but very tannic"]
    },
  
    zinfandel: {
      name: "Zinfandel",
      wset: {
        color: "Medium to deep ruby",
        body: "Full",
        acidity: "Medium",
        tannin: "Medium+",
        sweetness: "Dry to off-dry"
      },
      aroma_flavor: ["Jammy berry", "Spice", "Black pepper"],
      regions: ["California"],
      styles: ["Big reds", "Rosé (White Zinfandel)"],
      food_pairing: ["BBQ", "Spicy food"],
      key_notes: ["High alcohol, ripe fruit"]
    },
  
    tempranillo: {
      name: "Tempranillo",
      wset: {
        color: "Medium ruby",
        body: "Medium to full",
        acidity: "Medium",
        tannin: "Medium+",
        sweetness: "Dry"
      },
      aroma_flavor: ["Strawberry", "Plum", "Leather", "Tobacco"],
      regions: ["Rioja", "Ribera del Duero"],
      styles: ["Oak-aged Spanish reds"],
      food_pairing: ["Roast lamb", "Tapas"],
      key_notes: ["Oak aging very important"]
    },
  
    chardonnay: {
      name: "Chardonnay",
      wset: {
        color: "Medium lemon to gold",
        body: "Medium to full",
        acidity: "Medium+",
        tannin: "None",
        sweetness: "Dry"
      },
      aroma_flavor: ["Apple", "Lemon", "Butter", "Vanilla"],
      regions: ["Burgundy", "California", "Australia", "Chablis"],
      styles: ["Oaked", "Unoaked", "Sparkling base"],
      food_pairing: ["Chicken", "Seafood", "Cream sauces"],
      key_notes: ["Winemaking changes everything"]
    },
  
    sauvignon_blanc: {
      name: "Sauvignon Blanc",
      wset: {
        color: "Pale lemon",
        body: "Light to medium",
        acidity: "High",
        tannin: "None",
        sweetness: "Dry"
      },
      aroma_flavor: ["Gooseberry", "Lime", "Grass", "Herbaceous"],
      regions: ["Loire Valley", "New Zealand", "Chile"],
      styles: ["Unoaked crisp whites"],
      food_pairing: ["Goat cheese", "Salads"],
      key_notes: ["High aromatics, green notes"]
    },
  
    riesling: {
      name: "Riesling",
      wset: {
        color: "Pale lemon",
        body: "Light",
        acidity: "High",
        tannin: "None",
        sweetness: "Dry to sweet"
      },
      aroma_flavor: ["Lime", "Green apple", "Petrol (aged)"],
      regions: ["Germany", "Alsace"],
      styles: ["Dry, off-dry, sweet"],
      food_pairing: ["Spicy food", "Asian cuisine"],
      key_notes: ["High acid + variable sweetness"]
    },
  
    pinot_grigio: {
      name: "Pinot Grigio",
      wset: {
        color: "Pale lemon",
        body: "Light",
        acidity: "Medium",
        tannin: "None",
        sweetness: "Dry"
      },
      aroma_flavor: ["Pear", "Lemon", "Apple"],
      regions: ["Italy"],
      styles: ["Crisp white"],
      food_pairing: ["Seafood", "Light salads"],
      key_notes: ["Simple, fresh profile"]
    },
  
    gewurztraminer: {
      name: "Gewürztraminer",
      wset: {
        color: "Pale to medium gold",
        body: "Medium",
        acidity: "Low to medium",
        tannin: "None",
        sweetness: "Dry to sweet"
      },
      aroma_flavor: ["Lychee", "Rose", "Spice"],
      regions: ["Alsace"],
      styles: ["Aromatic whites"],
      food_pairing: ["Spicy Asian food"],
      key_notes: ["Very aromatic, distinctive"]
    },
  
    viognier: {
      name: "Viognier",
      wset: {
        color: "Medium gold",
        body: "Medium to full",
        acidity: "Low to medium",
        tannin: "None",
        sweetness: "Dry"
      },
      aroma_flavor: ["Apricot", "Peach", "Floral"],
      regions: ["Rhône Valley"],
      styles: ["Aromatic whites"],
      food_pairing: ["Chicken", "Cream sauces"],
      key_notes: ["Low acidity, perfumed"]
    },
  
    chenin_blanc: {
      name: "Chenin Blanc",
      wset: {
        color: "Pale lemon",
        body: "Light to medium",
        acidity: "High",
        tannin: "None",
        sweetness: "Dry to sweet"
      },
      aroma_flavor: ["Apple", "Honey", "Quince"],
      regions: ["Loire Valley", "South Africa"],
      styles: ["Still, sparkling, sweet"],
      food_pairing: ["Pork", "Spicy food"],
      key_notes: ["Extremely versatile"]
    },
  
    // ---- additional grapes (compressed but complete set continues similarly) ----
  
    gamay: { name: "Gamay", wset: { color: "Light ruby", body: "Light", acidity: "High", tannin: "Low", sweetness: "Dry" }, aroma_flavor: ["Red cherry", "Banana (carbonic maceration)"], regions: ["Beaujolais"], styles: ["Light reds"], food_pairing: ["Charcuterie"], key_notes: ["Very fruity, low tannin"] },
  
    cinsault: { name: "Cinsault", wset: { color: "Pale ruby", body: "Light", acidity: "Medium", tannin: "Low", sweetness: "Dry" }, aroma_flavor: ["Strawberry", "Herbs"], regions: ["Southern France"], styles: ["Rosé blends"], food_pairing: ["Mediterranean food"], key_notes: ["Soft and fruity"] },
  
    mourvedre: { name: "Mourvèdre", wset: { color: "Deep ruby", body: "Full", acidity: "Medium", tannin: "High", sweetness: "Dry" }, aroma_flavor: ["Blackberry", "Game", "Earth"], regions: ["Rhône", "Spain"], styles: ["Blends"], food_pairing: ["Game meats"], key_notes: ["Savory, structured"] },
  
    petit_verdot: { name: "Petit Verdot", wset: { color: "Deep purple", body: "Full", acidity: "High", tannin: "High", sweetness: "Dry" }, aroma_flavor: ["Black fruit", "Floral", "Spice"], regions: ["Bordeaux", "Australia"], styles: ["Blends"], food_pairing: ["Steak"], key_notes: ["Used for blending"] },
  
    carignan: { name: "Carignan", wset: { color: "Medium ruby", body: "Medium", acidity: "High", tannin: "High", sweetness: "Dry" }, aroma_flavor: ["Blackberry", "Spice"], regions: ["Southern France", "Spain"], styles: ["Blends"], food_pairing: ["BBQ"], key_notes: ["High acid and tannin"] },
  
    barbera: { name: "Barbera", wset: { color: "Deep ruby", body: "Medium", acidity: "High", tannin: "Low", sweetness: "Dry" }, aroma_flavor: ["Cherry", "Plum"], regions: ["Piedmont"], styles: ["Italian reds"], food_pairing: ["Pasta"], key_notes: ["High acid, low tannin"] },
  
    dolcetto: { name: "Dolcetto", wset: { color: "Deep ruby", body: "Medium", acidity: "Medium", tannin: "Medium", sweetness: "Dry" }, aroma_flavor: ["Black cherry", "Licorice"], regions: ["Piedmont"], styles: ["Everyday reds"], food_pairing: ["Pizza"], key_notes: ["Soft, fruity"] },
  
    trebbiano: { name: "Trebbiano", wset: { color: "Pale lemon", body: "Light", acidity: "High", tannin: "None", sweetness: "Dry" }, aroma_flavor: ["Lemon", "Apple"], regions: ["Italy", "France (Ugni Blanc)"], styles: ["Neutral whites"], food_pairing: ["Seafood"], key_notes: ["High acid, neutral"] },
  
    albariño: { name: "Albariño", wset: { color: "Pale lemon", body: "Light to medium", acidity: "High", tannin: "None", sweetness: "Dry" }, aroma_flavor: ["Peach", "Citrus", "Saline"], regions: ["Rías Baixas (Spain)"], styles: ["Crisp whites"], food_pairing: ["Seafood"], key_notes: ["Salty coastal character"] },
  
    verdelho: { name: "Verdelho", wset: { color: "Pale lemon", body: "Medium", acidity: "High", tannin: "None", sweetness: "Dry" }, aroma_flavor: ["Lime", "Herbs"], regions: ["Portugal", "Australia"], styles: ["Whites"], food_pairing: ["Fish"], key_notes: ["Crisp and herbal"] },
  
    semillon: { name: "Sémillon", wset: { color: "Pale gold", body: "Medium to full", acidity: "Low to medium", tannin: "None", sweetness: "Dry to sweet" }, aroma_flavor: ["Lemon", "Honey", "Lanolin"], regions: ["Bordeaux", "Australia"], styles: ["Dry whites", "Sweet wines (Sauternes)"], food_pairing: ["Foie gras", "Seafood"], key_notes: ["Key botrytised grape"] },
  
    muscat: { name: "Muscat", wset: { color: "Pale to deep gold", body: "Light to medium", acidity: "Low", tannin: "None", sweetness: "Dry to sweet" }, aroma_flavor: ["Grape", "Orange blossom", "Rose"], regions: ["France", "Italy"], styles: ["Sweet wines", "Aromatic dry whites"], food_pairing: ["Desserts"], key_notes: ["Very aromatic, grape-like flavor"] }
  };


  const listEl = document.getElementById("grape-list");
const detailEl = document.getElementById("grape-detail");
const searchEl = document.getElementById("search");

function renderList(filter = "") {
  listEl.innerHTML = "";
  detailEl.classList.add("hidden");

  Object.entries(grapes)
    .filter(([_, g]) =>
      g.name.toLowerCase().includes(filter.toLowerCase())
    )
    .forEach(([key, grape]) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `<h3>${grape.name}</h3>`;
      card.onclick = () => renderDetail(key);

      listEl.appendChild(card);
    });
}

function renderDetail(key) {
  const g = grapes[key];

  listEl.innerHTML = "";
  detailEl.classList.remove("hidden");

  detailEl.innerHTML = `
    <div class="back-btn">← Back to all grapes</div>

    <h2>${g.name}</h2>

    <div class="section">
      <h3>WSET Tasting Profile</h3>
      <div class="stats">
        <div class="stat"><strong>Color:</strong> ${g.wset.color}</div>
        <div class="stat"><strong>Body:</strong> ${g.wset.body}</div>
        <div class="stat"><strong>Acidity:</strong> ${g.wset.acidity}</div>
        <div class="stat"><strong>Tannin:</strong> ${g.wset.tannin}</div>
        <div class="stat"><strong>Sweetness:</strong> ${g.wset.sweetness}</div>
      </div>
    </div>

    <div class="section">
      <h3>Aroma & Flavor</h3>
      <ul>
        ${g.aroma_flavor.map(i => `<li>${i}</li>`).join("")}
      </ul>
    </div>

    <div class="section">
      <h3>Regions</h3>
      <ul>
        ${g.regions.map(i => `<li>${i}</li>`).join("")}
      </ul>
    </div>

    <div class="section">
      <h3>Styles</h3>
      <ul>
        ${g.styles.map(i => `<li>${i}</li>`).join("")}
      </ul>
    </div>

    <div class="section">
      <h3>Food Pairing</h3>
      <ul>
        ${g.food_pairing.map(i => `<li>${i}</li>`).join("")}
      </ul>
    </div>

    <div class="section">
      <h3>Exam Notes</h3>
      <ul>
        ${g.key_notes.map(i => `<li>${i}</li>`).join("")}
      </ul>
    </div>
  `;

  document.querySelector(".back-btn").onclick = () => renderList(searchEl.value);
}

searchEl.addEventListener("input", (e) => {
  renderList(e.target.value);
});

renderList();